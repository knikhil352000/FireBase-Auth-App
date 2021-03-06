//add admin cloud functions
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({ email: adminEmail}).then(result => {
        console.log(result);
    });
})

/*****************************************************************/
//listen for auth status change

auth.onAuthStateChanged(user => {
    if(user){
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin; 
            setupUI(user);
        })
        // console.log('User logged In', user);
        // get data
    db.collection('guides').onSnapshot((snapshot) => { //for realtime database remove get and use onSnapshot function
        setupGuides(snapshot.docs);
        
})
    }else{
        // console.log('User logged Out');
        setupUI();
        setupGuides([]);
    }
});

/*****************************************************************/
//Create new guide

const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then(() => {
        //close the modal
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    }, err =>{
        console.log('You are not authenticated');
    })
});

/*****************************************************************/

// Sign Up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    //sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            bio: signupForm['signup-bio'].value
        })
    }).then(() => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    }) //asynchronous task
})

/*****************************************************************/

//logout method
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

/*****************************************************************/

//login method
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('click', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    
    auth.signInWithEmailAndPassword(email, password).then( cred => {
        //close the modal
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    });
});

/*****************************************************************/