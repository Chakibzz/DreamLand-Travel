# EmailJS Setup (DreamLand Travel)

## 1) Create EmailJS assets
- Service: create one service (Gmail/Outlook/etc.)
- Template: create one template
- Public Key: from Account > API Keys

## 2) Put keys in `.env.local`

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

## 3) Template variables to use in EmailJS
Use these exact placeholders in your template body/subject:

- `{{to_email}}` -> ayari897@gmail.com
- `{{to_name}}` -> DreamLand Travel
- `{{from_name}}`
- `{{from_email}}`
- `{{reply_to}}`
- `{{phone}}`
- `{{subject}}`
- `{{message}}`
- `{{sent_at}}`

## 4) Suggested template subject/body

Subject:
`[Website Contact] {{subject}}`

Body:
`You received a new contact request.`

`Name: {{from_name}}`
`Email: {{from_email}}`
`Phone: {{phone}}`
`Sent at: {{sent_at}}`

`Message:`
`{{message}}`

`Recipient: {{to_email}}`

## 5) Important EmailJS settings
- In template, set Reply-To to `{{reply_to}}`
- Save and publish template

## 6) Run app
`npm run dev`
