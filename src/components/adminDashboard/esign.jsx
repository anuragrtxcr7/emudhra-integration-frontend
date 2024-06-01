import React, { useEffect, useState } from "react";
import './esign.css'
const Esign = () => {

    const [fetchedTemplates, setFetchedTemplates] = useState([]);
    // const fetchedTemplates=[
        // {
        //   TemplateId: 15682,
        //   TemplateName: 'loan agreement',
        //   ParentId: 0,
        //   TemplateType: 1,
        //   SubscriberId: 12310
        // },
        // {
        //   TemplateId: 15683,
        //   TemplateName: 'New node',
        //   ParentId: 15682,
        //   TemplateType: 2,
        //   SubscriberId: 12310
        // },
        // {
        //   TemplateId: 15709,
        //   TemplateName: 'new',
        //   ParentId: 15682,
        //   TemplateType: 2,
        //   SubscriberId: 12310
        // },
        // {
        //   TemplateId: 15711,
        //   TemplateName: 'mynew',
        //   ParentId: 15682,
        //   TemplateType: 2,
        //   SubscriberId: 12310
        // },
        // {
        //   TemplateId: 15890,
        //   TemplateName: 'Testing Template',
        //   ParentId: 0,
        //   TemplateType: 2,
        //   SubscriberId: 12310
        // },
        // {
        //   TemplateId: 15891,
        //   TemplateName: 'Testing Template 2',
        //   ParentId: 0,
        //   TemplateType: 2,
        //   SubscriberId: 12310
        // },
        // {
        //   TemplateId: 15892,
        //   TemplateName: 'Testing Template 3',
        //   ParentId: 0,
        //   TemplateType: 1,
        //   SubscriberId: 12310
        // },
        // {
        //   TemplateId: 15895,
        //   TemplateName: '1 Signatory Template',
        //   ParentId: 0,
        //   TemplateType: 1,
        //   SubscriberId: 12310
        // },
        // {
        //   TemplateId: 15896,
        //   TemplateName: '3 Signatory Template',
        //   ParentId: 0,
        //   TemplateType: 1,
        //   SubscriberId: 12310
        // },
        // {
        //   TemplateId: 15897,
        //   TemplateName: 'Loan Agreement Template',
        //   ParentId: 0,
        //   TemplateType: 1,
        //   SubscriberId: 12310
        // }
    // ];

    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [selectedTemplateID, setSelectedTemplateID] = useState(0);
    const [isSelect, setIsSelect] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [numOfAllowedSignatories, setNumOfAllowedSignatories] = useState(0);
    const [numOfEnteredSignatories, setNumOfEnteredSignatories] = useState(0);
    const [signatories, setSignatories] = useState([]);
    const [isAddActive, setIsAddActive] = useState(false);
    const [eStampType, setEstampType] = useState("None");
    const [stateForEstamp, setStateforEstamp] = useState("");
    const [wantEstamp, setWantEstamp] = useState(false);
    const [fileName, setFileName] = useState();
    const [base64file, setbase64file] = useState();
    const [final64File, setFinal64File] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const [reminder, setReminder] = useState(0);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [signingType, setSigningType] = useState(1);
    const [workFlowId, setWorkFlowId] = useState();
    
  
    const onFileChange = (event) => {
      var selectedFile = event.target.files[0];
      if (selectedFile) {
        setFileName(selectedFile.name);
        console.log(selectedFile.name);
        var reader = new FileReader();
        reader.onload = function (event) {
          var selectedFile = selectedFile;
          // Convert the file to Base64
          var selectedFileBase64 = event.target.result.split(",")[1];
          setbase64file(selectedFileBase64);
          console.log(selectedFileBase64);
        };
        reader.readAsDataURL(selectedFile);
      }
    };

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
            alert('Signatory with the same email, name, or contact number already exists in the array.');
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
            setNumOfEnteredSignatories((num)=>(num+1));
            console.log(numOfEnteredSignatories);
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
        setNumOfEnteredSignatories(updatedSignatories.length);
        console.log(updatedSignatories.length);
    }
    const TemplateSelectorButtonHandler = (props) => {
        setIsSelect(true);
        setSelectedTemplate(props.TemplateName);
        setSelectedTemplateID(props.TemplateId);
        if(props.TemplateId===15896) setNumOfAllowedSignatories(3);
        else if(props.TemplateId===15929)setNumOfAllowedSignatories(2);
        else setNumOfAllowedSignatories(1);
        // console.log(props.TemplateId);
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


    // const getFinalDocumentDetails = async(workId)=>{
    //     try {
    //         // console.log(JSON.stringify(window.localStorage.getItem("emsignerAuthToken")))
            
    //         const response = await fetch("http://localhost:8000/api/GetWorkflowInfo", {
    //             method: "POST",
    //             headers: {"Authorization": window.localStorage.getItem("emsignerAuthToken")},
    //             body: JSON.stringify(
    //                 {
    //                     "WorkflowId": 54086, 
    //                 }
    //             )
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch');
    //         }
    //         else{
    //             const data = await response.json();
    //             console.log(data);
    //             // const base64String = "data:application/pdf;base64," + ;
    //         }
            
    //         // setFetchedTemplates(data.Response);
    //     } catch (e) {
    //         console.error('Error fetching data:', e);
    //     }
    // }

    const submitForEsign = async () => {
        
        try {
            // console.log(JSON.stringify(window.localStorage.getItem("emsignerAuthToken")))
            if(selectedTemplateID===15895 || selectedTemplateID===15929){
                setIsSubmitLoading(true);
                const response = await fetch("http://localhost:8000/api/InitiateAndSign", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": window.localStorage.getItem("emsignerAuthToken")
                    },
                    body: JSON.stringify([
                        {
                            "Data": "<DocumentElement><BulkData><Name>John</Name><City>LA</City></BulkData></DocumentElement>",
                            "DocumentName":fileName,
                            "FileData":base64file,
                            "Signatories": signatories,
                            "TemplateId": selectedTemplateID,
                            "Reminder":  reminder || 0,
                            "SigningType": signingType,
                            "DonotSendCompletionMailToParticipants": false,
                        }]
                    )
                });
                setIsSubmitLoading(false);
                if (!response.ok) {
                    setSuccessMessage("Did Not succeed");
                    throw new Error('Failed to fetch');
                }
                else{
                    const data = await response.json();
                    if(data.IsSuccess===true){
                        setSuccessMessage("success");
                        setWorkFlowId(data.Response.WorkflowId)
                        // console.log(data.Response.WorkflowId)
                        getFinalDocumentDetails(data.Response.WorkflowId);
                        // Fetch Download API
                    }
                    else setSuccessMessage("Did Not succeed");
                    console.log(data);
                }
            }
            else{
                setIsSubmitLoading(true);
                const response = await fetch("http://localhost:8000/api/InitiateAndSignFlexiForm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": window.localStorage.getItem("emsignerAuthToken")
                    },
                    body: JSON.stringify([
                        {
                            "Data": "<DocumentElement><BulkData><Name>John</Name><City>LA</City></BulkData></DocumentElement>",
                            "Signatories": [...signatories,{
                                "EmailId": "pranavnahar@gmail.com",
                                "Name": "Pranav Nahar",
                                "ContactNo": "",
                                "ModeOfSignature": "3",
                                "MailSendingOptions": 1,
                                "ModeofAuthentication": 0
                            }],
                            "TemplateId": selectedTemplateID,
                            "DonotSendCompletionMailToParticipants": false,
                            "Reminder": reminder || 0,
                            "SigningType": "1", // Parellel Signing not enabled for flexi-form
                            "eStampType": "None",
                            "State": "",
                            "Denomination": 0
                        }]
                    )
                });
                setIsSubmitLoading(false);
                if (!response.ok) {
                    setSuccessMessage("Did Not succeed");
                    throw new Error('Failed to fetch');
                }
                else{
                    const data = await response.json();
                    if(data.IsSuccess===true){
                        setSuccessMessage("success");
                        setWorkFlowId(data.Response.WorkflowId)
                        // Fetch Download API
                    }
                    else setSuccessMessage("Did Not succeed");
                    console.log(data);
                }
            }
        } catch (e) {
            setIsSubmitLoading(false);
            setSuccessMessage("Did Not succeed");
            console.error('Error fetching data:', e);
        }
    }


    // Sample Template - 2 -> ID -> 15891
    // console.log(fetchedTemplates[0])
    // console.log(selectedTemplate);

    // console.log(signatories);
    useEffect(()=>{
        fetchTemplates();
        // getFinalDocumentDetails();
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
                {selectedTemplateID?((selectedTemplateID===15895 || selectedTemplateID===15929)?("This is a Template (So First Select Signatories and then the file)"):("This is a Flexi-Form So only Select the number of signatories")):("Select a WorkFlow")}
                {isSelect && (
                    <div>
                        <div>Ensure that the number of signatories are {numOfAllowedSignatories}</div>
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
                                <><div>Add {selectedTemplateID===15896?("3"):selectedTemplateID===15929?("2"):("1")} Signatories</div></>
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
                        ) : ((numOfEnteredSignatories<numOfAllowedSignatories)?(
                            <button onClick={() => setIsAddActive(true)}>Add Signatory</button>
                        ):((numOfEnteredSignatories===numOfAllowedSignatories)?(`All ${numOfAllowedSignatories} Signatories added`):(alert(`Reduce ${numOfEnteredSignatories-numOfAllowedSignatories} Signatories`)))
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
                            {(selectedTemplateID===15895)||(selectedTemplateID===15929)?(<div>
                                <h3>Now select the file where you want the signing to be done</h3>
                                <input type="file" onChange={(e) => onFileChange(e)} />
                            </div>
                            ):("Proceed Further")}
                            {selectedTemplateID===15895?("Proceed Further"):(
                                <div>
                                    <h3>Mr Pranav Nahar will recieve the document after all the signatories have signed and will acknowlede his signature respectively for itenary to be complete</h3>
                                </div>
                            )}
                            <br />
                            <span>Enter The Number of Days after which you want a reminder everytime</span><input type="number" placeholder="Enter Number" onChange={(e)=>(setReminder(e.target.value))}/>
                            <br />
                            <label for="signMethod">Choose a Signing Method</label>
                            <select name="signMethod" id="signMethod" onChange={(e)=>(setSigningType(e.target.value))}>
                                <option value="1">Serial Signing</option>
                                {(selectedTemplateID===15895)||(selectedTemplateID===15929)?<option value="2">Parallel</option>:<></>} 
                            </select>
                            <br />
                            <button
                             onClick={submitForEsign}
                             >
                                Submit For Esign Procedure.
                            </button>
                            <br />
                            {isSubmitLoading?<h2>Loading</h2>:successMessage?(<div>
                                <h2>{successMessage}</h2>
                                <br />
                                {/* {successMessage==="success" ? (<div>
                                    <a href="" download="convertedPDFFile.pdf">Click Here to Download PDF</a>
                                </div>):<div></div>} */}
                            </div>):<h2></h2>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </>)
};
export default Esign;