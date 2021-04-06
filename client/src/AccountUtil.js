
export function login(username, password, id){
    var isLoggedIn = true;

    //validate crediental   

    console.log(username);

    localStorage.setItem('AccountData',  JSON.stringify(
            {isLoggedIn: isLoggedIn,
            username: username,
            token: id
            })
        );
    
}

function accountExists(){
    return localStorage.getItem('AccountData') != null;
}

export function logout(){
    localStorage.setItem('AccountData', {
        isLoggedIn: false,
        username: "",
        token: ""});
    console.log("Logging user out");

}

export function getAccount(){
    if( accountExists() ){
        console.log("Return account!!");
        try{
        console.log(JSON.parse( localStorage.getItem('AccountData') ));
        }catch(e){
            return false;
        }

        return JSON.parse(localStorage.getItem('AccountData'));
    }else{
        return false;
    }
}

export function getUsername(){
    return accountExists() && localStorage.get('AccountData').username;
}

export function getToken(){
    return accountExists() && localStorage.get('AccountData').token;
}

export function isLoggedIn(){
    return accountExists() && localStorage.get('AccountData').isLoggedIn;
}