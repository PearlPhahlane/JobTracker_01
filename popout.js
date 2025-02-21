document.addEventListener("DOMContentLoaded", function(){

    //select DOM elements 
    const addJobView = document.getElementById("addJobView");
    const jobTitleInput = document.getElementById("jobTitleInput");
    const jobDescriptionInput = document.getElementById("jobDescriptionInput");
    const jobLinkInput = document.getElementById("jobLinkInput");
    const jobStatusInput = document.getElementById("jobStatusInput");
    const saveJobBtn = document.getElementById("saveJob");
    const jobListView = document.getElementById("jobListView");
    const jobList = document.getElementById("jobList");
    const jobDetailView = document.getElementById("jobDetailView");
    const saveNoteBtn = document.getElementById("saveNote");
    const noteInput = document.getElementById("noteInput");
    const backToListBtn = document.getElementById("backToList");

    //I've created an add new job button that shows only when we click on the back to list button
    const addJobButtonContainer = document.createElement('div');
    addJobButtonContainer.style.marginBottom = "10px";
    addJobButtonContainer.style.display = "none" //ensure that the button is initially hidden
    addJobButtonContainer.innerHTML - `
        <button id="addNewJobBtn" style="background-color: #4CAF50; color: White; 
        padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer">Add New Job</button>`;
    jobList.parentNode.insertBefore(addJobButtonContainer, jobList);

    //select the above button and add event listner 
    document.getElementById("addNewJobBtn").addEventListener("click", function(){
        showView(addJobView);
    });

    


   




});