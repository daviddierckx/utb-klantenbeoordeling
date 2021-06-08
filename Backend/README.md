# UTB-Feedback Backend

### Setup Guide

- Run `npm install` in your console
- Create a .env file and add the lines below listed in #Errors-Missing\_.env_File

### How to start?

- Run `npm start`

##Errors

#### Missing .env file?

Add this to your .env:

```
DATABASE_ADDRESS=onno204.nl
DATABASE_USERNAME=avans_utb
DATABASE_PASSWORD=IyxNtWwrP/pfBx15
DATABASE_DATABASE=avans_utb
AUTH_SECRET=c5o9megz9j2ipw8t77rytuk7k98zku89by9g52dqnc22h9c04ws0odjutogdsce3g7ipbescrnr4pnoqvly05by3o73g2aoe01pbkdkhtd52dmmuj5ie85i2xixmz1vc
```

### Routes

// must haves
router.get('/admin/console', forms_controller.placeholder);
router.post('/login', forms_controller.placeholder);
router.get('/admin/feedback/overview', forms_controller.placeholder);
router.delete('/admin/feedback/:feedbackId', forms_controller.placeholder);
router.put('/admin/feedback/:feedbackId', forms_controller.placeholder);
router.get('/admin/users/overview', forms_controller.placeholder);
router.post('/admin/users', forms_controller.placeholder);
router.delete('/admin/users/:userId', forms_controller.placeholder);
router.put('/admin/users/:userId', forms_controller.placeholder);
// should haves
router.post('/admin/feedback/:formId', forms_controller.placeholder);
router.delete('/admin/feedback/:formId', forms_controller.placeholder);
router.put('/admin/feedback/:formId', forms_controller.placeholder);
router.get('/feedback/overview/:date', forms_controller.placeholder);
router.get('/feedback/overview/:rating', forms_controller.placeholder);
router.get('/admin/admin/feedback/:formId', forms_controller.placeholder);
// could haves
router.get('/feedback/overview/:orderNr', forms_controller.placeholder);
router.delete('/complaints/:complaintNr', forms_controller.placeholder);

---

router.post("/register", user_controller.register);
router.post("/login", user_controller.login);

// Add router here
// must haves
router.get('/feedback/:formId/addAnswer', forms_controller.enter_form_answer);
router.get('/feedback', forms_controller.placeholder);
router.get('/complaints/overview', forms_controller.placeholder);
// should haves
router.get('/api/feedback/overview');
// could haves
router.get('/complaints/overview', forms_controller.placeholder);
router.post('/complaints', forms_controller.placeholder);
router.put('/complaints/:complaintNr', forms_controller.placeholder);
router.get('/complaints/:complaintNr', forms_controller.placeholder);
