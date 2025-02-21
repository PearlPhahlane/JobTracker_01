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

    //Hide jobDetailView on Initial Load
    jobDetailView.style.display = "none";

    //stores the currently selected job ID
    let selectedJobId = null;

    //function to load jobs from storage
    function loadJobs() {
        chrome.storage.local.get(["jobs"], function(data){
            jobList.innerHTML = "";
            const jobs = data.jobs || [].sort((a, b) => new Date(b.date) - new Date(a.date)); //added jobs will appear in ascending order -latest first
            jobs.forEach((job) => {
                const li = document.createElement("li");
                li.dataset.id = job.id;
                li.innerHTML = `
                    <strong>${job.title}</strong> (${job.date})&nbsp;&nbsp;
                    <div class="job-status">Status: ${job.status}</div>
                    <div class="job-actions">
                        <button class="viewBtn" title="View Details">🔍</button>
                        <button class="deleteBtn" title="Delete Job">❌</button>
                    </div>`;
                jobList.appendChild(li);
                
            })
        })
    }



   




});