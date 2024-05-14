import React, { useEffect,useState } from "react";
const AdminDashboard = () => {
    
const emsignerAuthToken=window.localStorage.getItem("emsignerAuthToken");
const emsignerButtonHandler=(e)=>{
    e.preventDefault();
    setTimeout(() => {
        window.location.href = "/emsignerDashboard";
    }, 1000);
}
const EsignFlowInitiatingButtonHandler=(e)=>{
    e.preventDefault();
    setTimeout(() => {
        window.location.href = "/esign";
    }, 1000);

}
    return (
        <>
            <div>
                <p>Go to emsigner dashboard</p><p><button onClick={emsignerButtonHandler}>go</button></p>
                <p>View Loan Requests</p>
                <p>Go to E-signing flow <button onClick={EsignFlowInitiatingButtonHandler}>go</button></p>
            </div>
        </>
    )
}
export default AdminDashboard;