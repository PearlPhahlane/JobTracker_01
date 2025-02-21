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

                //add click event listner for view button
                const viewBtn = li.querySelector(".viewBtn");
                viewBtn.addEventListener("click", function () {
                    showJobDetails(job.id);
                });


                //add click event listener for delete button
                const deleteBtn = li.querySelector(".deleteBtn");
                deleteBtn.addEventListener("click", function(){
                    deleteJob(job.id);
                });
            });
        });
    }

    //function to show job details
    function showJobDetails(jobId){
        chrome.storage.local.get(["jobs"], function(data){
            const job = data.jobs.find((j) => j.id == jobId);
            if(job) {
                selectedJobId = job.id;
                document.getElementById("jobTitle").textContext = job.title;
                document.getElementById("jobStatus").textContent = `Status: ${job.status}`;
                document.getElementById("jobDescription").innerHTML = job.description.replace(/\n/g, "<br>");
                document.getElementById("jobLink").href = job.link;

                //the link will open in a new tab and not on the popup window
                const jobLink = document.getElementById("jobLink");
                jobLink.href = job.link;
                jobLink.target = "_blank" //ensures that link will open in the browser in a new tab

                loadJobNotes(job);


                //status dropdown
                const statusDropdown = document.createElement("select");
                statusDropdown.id = "statusDropdown";
                ["Awaiting Response", "Successful", "Unsuccessful"].forEach(
                    (status) => {
                        const option = document.createElement("option");
                        option.value = status;
                        option.textContent = status;
                        if (status === job.status) option.selected = true;
                        statusDropdown.appendChild(option);
                    }
                );

                //here we create an update button for the status dropdown selection
                const updateStatusBtn = document.createElement("button");
                updateStatusBtn.textContent = "Update Status";
                updateStatusBtn.style.marginLeft = "10px";
                updateStatusBtn.addEventListener("click", function() {
                    updateJobStatus(statusDropdown.value);
                });

                //append to the job status section
                const jobStatusContainer = document.getElementById("jobStatus");
                jobStatusContainer.innerHTML = `Status: ${job.status}`;
                jobStatusContainer.appendChild(statusDropdown);
                jobStatusContainer.appendChild(updateStatusBtn);

                history.pushState( { view: "jobDetailView" }, "", "#jobDetailView");
                showView("jobDetailView");
            }
        })
    }

    //function to update the job status in chrome storage
    function updateJobStatus(newStatus){
        chrome.storage.local.get(["jobs"], function(data){
            const jobs = data.jobs || [];
            const job = jobs.find((j) => j.id == selectedJobId);
            if(job) {
                job.status = newStatus;
                chrome.storage.local.set({ jobs }, function() {
                    //refresh UI to show updated status
                    document.getElementById("jobStatus").innerHTML = 
                    `Status: ${newStatus}`;
                    alert("Job status updated successfully!");
                });
            }
        });
    }

    //function to delete a job
    function deleteJob(jobId) {
        if(confirm("Are you sure you want to delete this job?")){
            chrome.storage.local.get([jobs], function(data) {
                const jobs = data.jobs || [];
                const updatedJobs = jobs.filter((job) => job.id != jobId);
                chrome.storage.local.set({ jobs: updatedJobs }, function() {
                    loadJobs(); //reload the list after deletion 
                });
            });
        }
    }

    //Add job
    saveJobBtn.addEventListener("click", function () {
        const title = jobTitleInput.value.trim();
        const description = jobDescriptionInput.value.trim();
        const link = jobLinkInput.value.trim();
        const status = jobStatusInput.value;

        if(!title || !description || !link || !status) {
            alert("Please fill in all fields.");
            return;
        }

         const job = {
           id: Date.now(),
           title,
           description,
           link,
           status,
           date: new Date().toLocaleDateString(),
           notes: [],
         };

         chrome.storage.local.get(["jobs"], function (data) {
            const jobs = data.jobs || [];
            jobs.unshift(job); //ensures new jobs are added to beginning of list
            chrome.storage.local.set({jobs}, function(){
                clearInputFields();
                showView("jobListView") //switch to list view after clicking save button
                loadJobs(); //refresh the job list
            });
         });
    });

    //show job details
    jobList.addEventListener("click", function(e) {
        if(e.target.classList.contains("viewBtn")){
            const jobId = e.target.parentElement.dataset.id;
            chrome.storage.local.get(["jobs"], function(data){
                const job = data.jobs.find((j) => j.id == jobId);
                if(job) {
                    selectedJobId = job.id;
                    document.getElementById("jobTitle").textContent = job.title;
                    document.getElementById("jobStatus").textontent = `Status: ${job.status}`
                    document.getElementById("jobDescription").innerHTML =
                      job.description.replace(/\n/g, "<br>");
                    document.getElementById("jobLink").href = job.link;
                    loadJobNotes();

                    history.pushState({ view: "jobDetailView"}, "", "#jobDetailView");
                    showView("jobDetailView");
                }
            });
        }
    });

    //save note
    saveNoteBtn.addEventListener("click", function() {
        const note = noteInput.value.trim();
        if(note) {
            chrome.storage.local.get(["jobs"], function(data){
                const jobs = data.jobs || [];
                const job = jobs.find((j) => j.id == selectedJobId);
                if(job) {
                    job.notes.push({note, data: new Date().toLocaleString()});
                    chrome.storage.local.set({jobs}, function() {
                        loadJobNotes(jobs);
                        noteInput.value = "";
                    });
                }

            });
        
        }
    });

    //Load job notes
    function loadJobNotes(job) {
        const notesList = document.getElementById("notesList");
        notesList.innerHTML = "";

        job.notes.forEach((noteData, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
            <div class="note-content">
            <span class="note-text">${noteData.note}</span>
            <span class="note-date">${noteData.date}</span>
            </div>
            <button class="editNoteBtn" data-index"${index}">✏️</button>
            <button class="deleteNoteBtn" data-index"${index}">🗑</button>
            `;

            notesList.appendChild(li);

            //event listeners for edit and delete

            li.querySelector(".editNoteBtn").addEventListener("click", function() { 
                editNote(job.id, index);
            });

            li.querySelector(".deleteNoteBtn").addEventListener("click", function() {
                deleteNote(job.id, index);
            });
        });
    }

    function editNote(jobId, noteIndex) {
        chrome.storage.local.get(["jobs"], function(data) {
            let jobs = data.jobs || [];
            let job = jobs.find((j) => j.id == jobId);

            if(job){
                const newNote = prompt("Edit your note:", job.notes[noteIndex].note);
                if(newNote !== null) {
                    job.notes[note.Index].note = newNote;
                    chrome.storage.local.set({jobs}, function () {
                        loadJobNotes(job);
                    });
                }
            }
        });
    }

    function deleteNote(jobId, noteIndex) {
        if(confirm("Are you sure you want to delte this note?")) {
            chrome.storage.local.get(["jobs"], function(data){
                let jobs = data.jobs || [];
                let job = jobs.find((j) =>j.id == jobId);

                if(job){
                    job.notes.splice(noteIndex, 1); //remove note
                    chrome.storage.local.set({jobs}, function() {
                        loadJobNotes(job);
                    });

                }
            });
        }
    }

    



})

   





   




});
