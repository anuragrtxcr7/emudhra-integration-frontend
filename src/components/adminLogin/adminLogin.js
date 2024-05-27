import React, { useState } from "react";

const AdminLogin = ()=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [wrongCD, setWrondCd] = useState(false);

    const onSubmitHandler = (e)=>{
        e.preventDefault();
        console.log(email);
        console.log(password);
        setPassword("");
        setEmail("");
        fetch("http://localhost:8000/api/ValidateLogin",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "AppName":"Test App",
                "SecretKey":"17aeb60b-b531-4239-bd01-6aeae57c4c01"
            },
            body:JSON.stringify({
                UserName:email,
                Password:password
            })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if(data.IsSuccess===true){
                window.localStorage.setItem("emsignerAuthToken", data.Response.AuthToken);
                // alert("Login Successfull");
                // setTimeout(() => {
                    window.location.href = "/admindashboard";
                // }, 1000);
            }
            else {
                setWrondCd(true)
            }
        })
        // .then((data))
    }

    return(
        <>
            <div>
                <form action="http://localhost:8000/api/ValidateLogin" method="POST" onSubmit={onSubmitHandler}>
                    <div>
                        <input type="email" placeholder="email" onChange={(e)=>setEmail(e.target.value)} value={email} name="email"/>
                        <input type="password" placeholder="password" onChange={(e)=>setPassword(e.target.value)} value={password} name="password"/>
                        <button type="submit">
                            Login
                        </button>
                    </div>
                </form>
                {(wrongCD)?(<div>Please enter valid email id and password!</div>):(<div>Enter Details</div>)}
            </div>
        </>
    )
}
export default AdminLogin;