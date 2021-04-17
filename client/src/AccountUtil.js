
export function login(username, password, accountId, jwtToken, roomId){
    var isLoggedIn = true;

    //validate crediental   

    console.log("Loggin in and storing jwt: " + jwtToken);

    localStorage.setItem('AccountData',  JSON.stringify(
            {isLoggedIn: isLoggedIn,
            username: username,
            accountId: accountId,
            token: jwtToken,
            roomId: roomId
            })
        );
    
}

function accountExists(){
    return localStorage.getItem('AccountData') != null;
}

export function logout(){
    localStorage.setItem('AccountData', {});
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