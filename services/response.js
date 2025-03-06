import { sendApi } from './fbGraphApi.js'
import makeStorage from './storage.js'
import useSpreedSheet from './spreadsheet.js'
const storage = makeStorage()

async function begin(user, isEndTalk = false) {

    const doYouWantToKnowMore = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'button',
                text: 'Do you want to know more?',
                buttons: [
                    {
                        type: 'postback',
                        title: 'Who we are',
                        payload: 'ABOUT_US',
                    },
                    {
                        type: 'postback',
                        title: 'What we do',
                        payload: 'OUR_SERVICES',
                    }
                ]
            }
        }
    }

    sendApi(user.id, [
        { text: `Hi ${user.first_name}, Welcome ${isEndTalk ? 'back' : ''} to the App Page! 😊`},
        doYouWantToKnowMore
    ])
}

export async function typed(user, received_message) {

    function fillField({field, next_field, next_text_field}) { 
 
        storage.setUser(user.id, { ...storage.getUser(user.id), psid: user.id, [field]: received_message })

        const hasValue = storage.getUser(user.id).hasOwnProperty(field)

        if (hasValue) {

            storage.removeQuestion(user.id, field)
            storage.setQuestion(user.id, next_field, true)

            if (next_field === 'submitInquiry') {

                storage.setUser(user.id, { ...storage.getUser(user.id), psid: user.id, date_created: new Date() })
                const params = storage.getUser(user.id)

                const submitInqury = async () => (await useSpreedSheet()).sheet.addRow(params)  
                submitInqury()

                sendApi(user.id, [
                    {
                        text: 'Thank you for your inquiry! A Project Management Officer will be in touch with you within the next 24 to 48 hours.'
                    }
                ])
                 
            } else {

                sendApi(user.id,
                    [
                        {
                            text: next_text_field
                        }
                    ]
                )

            }

           
            
        }
      
    }

    if (received_message) {

        if(storage.isLiveChat(user.id)) {

            if (received_message.toLowerCase() === 'end talk') {
                storage.setLiveChat(user.id, false)
                return begin(user, true)
            }

        } else {

            if (received_message.toLowerCase() === 'restart bot') return begin(user)

            if (received_message.toLowerCase() === 'talk') {
                
                storage.setLiveChat(user.id, true)
    
                const name = storage.getUser(user.id)?.hasOwnProperty('name')
                    ?  storage.getUser(user.id).name : user.first_name
            
                sendApi(user.id, [
                    {
                        text: `Hi ${name}!, Have other questions or concerns not listed? Feel free to message here and our agent will get back to you with a response 😊`
                    },
                    {
                        text: 'You can type and send the word END TALK to go back to chat bot.'
                    }
                ])
            }
 

            if (storage.hasQuestion(user.id, 'name')) {
            
                fillField({field: 'name', next_field: 'company_name', next_text_field: 'Company Name?' })
        
            } else if (storage.hasQuestion(user.id, 'company_name')) {

                fillField({field: 'company_name', next_field: ' ', next_text_field: 'Designation?' })

            } else if (storage.hasQuestion(user.id, 'designation')) {

                fillField({field: 'designation', next_field: 'email', next_text_field: 'Your Email Address?' })

            } else if (storage.hasQuestion(user.id, 'email')) {

                fillField({field: 'email', next_field: 'mobile_number', next_text_field: 'Your Mobile Number?' })

            } else if (storage.hasQuestion(user.id, 'mobile_number')) {

                fillField({field: 'mobile_number', next_field: 'inquiries', next_text_field: 'In your own words, tell us what you need.' })

            } else if (storage.hasQuestion(user.id, 'inquiries')) {

                fillField({field: 'inquiries', next_field: 'submitInquiry', next_text_field: 'submitInquiry'})

            }

            storage.setPrevious(user.id, { ...storage.getPrevious(user.id), received_message })

        }

    }

}

export async function clicked(user, received_payload) {

    if (received_payload) {

        if (!storage.isLiveChat(user.id)) {

            const hasKey = (type) => received_payload.includes(type)

            if (hasKey('GET_STARTED')) return begin(user)
            if (hasKey('RESTART_BOT')) return begin(user)
    
            if(hasKey('ABOUT_US')) {
               sendApi(user.id,[
                   {
                    text: `About App.`
                   },
                   {
                    attachment: {
                        type: 'template',
                        payload: {
                            template_type: 'button',
                            text:  `Do you want to know more about App?`,
                            buttons: [
                                {
                                    type: "web_url",
                                    url: "https://www.app.com/",
                                    title: "Learn more",
                                    webview_height_ratio: "full"
                                },
                                {
                                    type: "postback",
                                    title: "Go back",
                                    payload: "RESTART_BOT"
                                }
                            ]
                        }
                    }
                }
               ])
            }
    
            if (hasKey('OUR_SERVICES')) {
                sendApi(user.id, [{
                    attachment: {
                    type: 'template',
                    payload:{
                        template_type:"generic",
                        elements:[
                            {
                                title:"App EMR",
                                image_url:"https://app.[server].com/images/img.jpg",
                                subtitle:"Cloud-based App Management Software",
                                buttons:[
                                    {
                                        type: "web_url",
                                        url: "https://www.facebook.com/app",
                                        title:"Check"
                                     }              
                                ] 
                            },
                            {
                                title:"App Order Management System",
                                image_url:"https://app.[server].com/images/img.png",
                                subtitle:"Cloud-based Product Management Software",
                                buttons:[
                                    {
                                        type: "web_url",
                                        url: "http://app.com",
                                        title:"Check"
                                    }              
                                ] 
                            },
                            {
                                title:"Software Development",
                                image_url:"https://app.[server].com/images/img.jpg",
                                subtitle:"We develop and provide software solutions",
                                buttons:[
                                    {
                                       type:"postback",
                                       title:"Inquire",
                                       payload:"INQUIRE_SOFTWARE_DEVELOPMENT"
                                    }              
                                ]
                            },
                            {
                                title:"Other Inquiries & Concerns",
                                image_url:"https://app.[server].com/images/img.jpg",
                                subtitle:"",
                                buttons:[
                                   {
                                      "type":"postback",
                                      "title":"Live Chat",
                                      "payload": "TALK"
                                    }              
                                ]    
                            }
                        ]
                        }
                    }
                    }
                    ]
                )
            }
     
            if(hasKey('TALK')) {

                storage.setLiveChat(user.id, true)

                const name = storage.getUser(user.id)?.hasOwnProperty('name')
                ?  storage.getUser(user.id).name : user.first_name

                sendApi(user.id, [
                {
                text: `Hi ${name}!, Have other questions or concerns not listed? Feel free to message us here and one of our Project Management Officer will get back to you. 😊`
                },
                {
                    text: 'You can type and send the word END TALK to go back to Chatbot.'
                }
                ])
            }
       
            if(hasKey('INQUIRE_SOFTWARE_DEVELOPMENT')) {
    
                storage.setQuestion(user.id, 'name', true)
    
                sendApi(user.id,
                    [
                        {
                            text: 'Your name please?'
                        }
                    ]
                )
    
            }

            storage.setPrevious(user.id, { ...storage.getPrevious(user.id), received_payload })

        }

        if (storage.isLiveChat(user.id)) {

            if (!['TALK', 'DISCARD_END_TALK', 'END_TALK'].includes(received_payload)) {

                if (storage.getPrevious(user.id).received_payload !== received_payload) {

                    sendApi(user.id, [
                        {
                            text: 'Do you want to end live chat?',
                            quick_replies: [
                                {
                                    title: 'Yes',
                                    payload: 'END_TALK'
                                },
                                {
                                    title: 'No',
                                    payload: 'DISCARD_END_TALK'
                                }
                            ].map(quick_reply => ({ content_type: 'text', ...quick_reply }))
                        }
                    ])
                }
            }
         
            if (received_payload === 'END_TALK') {
                storage.setLiveChat(user.id, false)
                console.log(storage.getPrevious(user.id).received_payload)
                return begin(user, true)
            }
        }
    }
}