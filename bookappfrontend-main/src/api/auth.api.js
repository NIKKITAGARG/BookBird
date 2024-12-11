import axios from "axios"

export async function Userlogin(phone, password, acc_type="user"){

    const loginBody = {
        phone,
        password,
        acc_type
    }

    let request = new Request(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        credentials : "include",
        body : JSON.stringify(loginBody)
    })

    let response = await fetch(request)
    response = await response.json()
    return response

}

export async function UserSignUp(username,phone,email, password){

    const signUpBody = {
        username,
        phone,
        email,
        password
    }

    let request = new Request(`${process.env.REACT_APP_BASE_URL}/auth/register`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        credentials : "include",
        body : JSON.stringify(signUpBody)
    })

    
    try {
        let response = await fetch(request);

        // Check if response is successful
        if (!response.ok) {
            // Throw an error with the status text
            throw new Error(`User Already Exists ${response.status}`);
        }

        // Parse JSON response
        response = await response.json();
        console.log(response);
        return response;

    } catch (error) {
        // Handle fetch or JSON parsing errors
        console.error("Error signing up:", error.message);

        return {error}
        
    }
    

}

export async function logoutUser(){
    const res = await axios({
        method : "get",
        url : `/auth/logout`
    })
    return res.data
}

export async function sendOtp(phone){
    
    const OtpBody = {
        phone
    }
    let request = new Request(`${process.env.REACT_APP_BASE_URL}/auth/email-verification`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        credentials : "include",
        body : JSON.stringify(OtpBody)
    })

    try {
        let response = await fetch(request);

        // Check if response is successful
        console.log(response);
        if (!response.ok) {
            // Throw an error with the status text
            throw new Error(` ${response.status == 404 ? "no email found with "+ phone : "Internal server error"}`);
        }

        // Parse JSON response
        response = await response.json();
        console.log(response);
        return response;

    } catch (error) {
        // Handle fetch or JSON parsing errors
        console.error("Error!!:", error.message);

        return {error}
        
    }


}