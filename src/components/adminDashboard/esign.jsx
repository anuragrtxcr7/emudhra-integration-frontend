import React, { useEffect, useState } from "react";
import './esign.css'
const Esign = () => {

    const [fetchedTemplates, setFetchedTemplates] = useState([]);
    // const fetchedTemplates=[
    //     {
    //         "TemplateId": 15598,
    //         "TemplateName": "Test",
    //         "ParentId": 0,
    //         "ParentTemplateName": null,
    //         "TemplateType": 1,
    //         "SubscriberId": 12310
    //     },
    //     {
    //         "TemplateId": 15602,
    //         "TemplateName": "demo",
    //         "ParentId": 0,
    //         "ParentTemplateName": null,
    //         "TemplateType": 1,
    //         "SubscriberId": 12310
    //     },
    //     {
    //         "TemplateId": 15682,
    //         "TemplateName": "loan agreement",
    //         "ParentId": 0,
    //         "ParentTemplateName": null,
    //         "TemplateType": 1,
    //         "SubscriberId": 12310
    //     },
    //     {
    //         "TemplateId": 15683,
    //         "TemplateName": "New node",
    //         "ParentId": 15682,
    //         "ParentTemplateName": null,
    //         "TemplateType": 2,
    //         "SubscriberId": 12310
    //     },
    //     {
    //         "TemplateId": 15709,
    //         "TemplateName": "new",
    //         "ParentId": 15682,
    //         "ParentTemplateName": null,
    //         "TemplateType": 2,
    //         "SubscriberId": 12310
    //     },
    //     {
    //         "TemplateId": 15711,
    //         "TemplateName": "mynew",
    //         "ParentId": 15682,
    //         "ParentTemplateName": null,
    //         "TemplateType": 2,
    //         "SubscriberId": 12310
    //     }
    // ];
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [selectedTemplateID, setSelectedTemplateID] = useState(0);
    const [isSelect, setIsSelect] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [signatories, setSignatories] = useState([]);
    const [isAddActive, setIsAddActive] = useState(false);
    const [eStampType, setEstampType] = useState("None");
    const [stateForEstamp, setStateforEstamp] = useState("");
    const [wantEstamp, setWantEstamp] = useState(false);
    const addSignatory = () => {
        if (name === "" || email === "" || contact === "") {
            console.warn("one or more fields are empty");
            return;
        }
        const existingSignatory = signatories.find(signatory =>
            signatory.EmailId === email || signatory.Name === name || signatory.ContactNo === contact
        );

        if (existingSignatory) {
            // If a signatory with the same details already exists, display a warning
            console.warn('Signatory with the same email, name, or contact number already exists in the array.');
        } else {
            // If no existing signatory found, add the new signatory to the array
            setSignatories([...signatories, {
                "EmailId": email,
                "Name": name,
                "ContactNo": "",
                "ModeOfSignature": "3",
                "MailSendingOptions": 1,
                "ModeofAuthentication": 0
            }]);
        }
        setIsAddActive(false);
        setName("");
        setEmail("");
        setContact("");
    }
    const DeleteHandler = () => {
        setIsAddActive(false);
        setName("");
        setEmail("");
        setContact("");
    }
    const DeleteSignatory = (props) => {
        const updatedSignatories = signatories.filter(signatory => signatory.EmailId !== props.EmailId);
        setSignatories(updatedSignatories);
    }
    const TemplateSelectorButtonHandler = (props) => {
        setIsSelect(true);
        setSelectedTemplate(props.TemplateName);
        setSelectedTemplateID(props.TemplateId);
            console.log(props.TemplateId);
    }
    const dropDownButtonHandler = () => {
        setIsDropdownActive(!isDropdownActive);
        // fetchTemplates();
    }
    const estampCheckboxhandler = () => {
        if (wantEstamp && stateForEstamp !== '') {
            setEstampType("offline");
            console.log("The state is good")
        }
        else if (wantEstamp) {
            console.log("Enter valid state name");
        }
    }
    const fetchTemplates = async () => {
        try {
            console.log(JSON.stringify(window.localStorage.getItem("emsignerAuthToken")))
            const response = await fetch("http://localhost:8000/api/ListTemplates", {
                method: "GET",
                headers: {
                    "Authorization": window.localStorage.getItem("emsignerAuthToken")
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            console.log(data.Response);
            setFetchedTemplates(data.Response);
        } catch (e) {
            console.error('Error fetching data:', e);
        }
    };

    const submitForEsign = async () => {
        try {
            // console.log(JSON.stringify(window.localStorage.getItem("emsignerAuthToken")))
            const response = await fetch("http://localhost:8000/api/InitiateAndSignFlexiForm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": window.localStorage.getItem("emsignerAuthToken")
                },
                body: JSON.stringify([
                    {
                        "Data": "<DocumentElement><BulkData><Name>John</Name><City>LA</City></BulkData></DocumentElement>",
                        "Signatories": signatories,
                        "TemplateId": selectedTemplateID,
                        "DonotSendCompletionMailToParticipants": true,
                        "Reminder": "2",
                        "eStampType": "None",
                        "State": "",
                        "Denomination": 0
                    }]
                )
            });
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            console.log(data);
            // setFetchedTemplates(data.Response);
        } catch (e) {
            console.error('Error fetching data:', e);
        }
    }


    // Sample Template - 2 -> ID -> 15891
    // console.log(fetchedTemplates[0])
    // console.log(selectedTemplate);

    // console.log(signatories);
    useEffect(()=>{
        fetchTemplates();
    },[])
    const [isDropdownActive, setIsDropdownActive] = useState(false);
    return (<>
        <div className="esignMain">
            <div className="templatesDropdownbtn">
                <p>
                {selectedTemplate===""? (
                        <p>Choose</p>
                    ):(
                        <p>{selectedTemplate}</p>
                    )}
                </p>
                <button className="templatesDropdownBtnInside" onClick={dropDownButtonHandler}>
                    select
                </button>
            </div>
            <div className="dropdownOptionsContainer">
                {isDropdownActive && (
                    <div className="templatesOptions">
                        {fetchedTemplates.length > 0 ? (
                            <div>
                                {fetchedTemplates.map((item, index) => (
                                    <div className="dropdownMenuItems" key={index} onClick={() => TemplateSelectorButtonHandler(item)}>
                                        {item.TemplateName}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <h2>Loading</h2>
                        )}
                    </div>
                )}
            </div>
            <div>
                {isSelect && (
                    <div>
                        <div>Ensure that the number of signatories are same as that specified in the selected template</div>
                        <div className="signatoryDetailsDisplay">
                            {signatories.length > 0 ? (
                                <div>
                                    {signatories.map((data, index) => (
                                        <div key={index}>
                                            <p>{data.Name}</p><p>{data.EmailId}</p><p>{data.ContactNo}</p>
                                            <button onClick={() => DeleteSignatory(data)}>Delete</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        {isAddActive ? (
                            <div className="signatoryDetails">
                                <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} value={name} required={true} />
                                <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} value={email} required={true} />
                                <input type="text" placeholder="Contact" onChange={e => setContact(e.target.value)} value={contact} required={true} />
                                <button onClick={addSignatory}>Add</button>
                                <button onClick={DeleteHandler}>Delete</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsAddActive(true)}>Add Signatory</button>
                        )}
                        <div className="estampChoice">
                            <div>
                                <label>
                                    <input type="checkbox" checked={wantEstamp} onChange={() => setWantEstamp((check)=>{
                                        return !check;
                                    })} />
                                    I want an e-stamp for this agreement
                                </label>
                                {wantEstamp && (
                                    <div>
                                        <label htmlFor="state">State for E-Stamp :</label>
                                        <input type="text" id="state" value={stateForEstamp} onChange={(e) => setStateforEstamp(e.target.value)} />
                                    </div>
                                )}
                                <div>
                                    <button onClick={estampCheckboxhandler}>Submit Estamp option</button>
                                </div>
                            </div>
                            <button
                             onClick={submitForEsign}
                             >
                                Submit For Esign Procedure.
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </>)
};
export default Esign;