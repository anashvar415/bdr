
  const createBtn = document.getElementById('createResumeBtn');
  const formContainer = document.getElementById('resumeForm');

  createBtn.addEventListener('click', () => {
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth' });
  });
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyCLEbK_p9daAwH6kiCJsD99DjSlHv3CWjE",
  authDomain: "build-your-resume-45078.firebaseapp.com",
  projectId: "build-your-resume-45078",
  storageBucket: "build-your-resume-45078.appspot.com",
  messagingSenderId: "999213099084",
  appId: "1:999213099084:web:4dbe463f5e404f29046ce9",
  measurementId: "G-ZS3VXTRTEG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
let profilePicDataUrl = "";

document.getElementById('profilePic').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      profilePicDataUrl = evt.target.result;
      // Show preview in the resume template (adjust ID as needed)
      const img = document.getElementById('resumeProfilePic');
      if (img) img.src = profilePicDataUrl;
    };
    reader.readAsDataURL(file);
  }
});
document.getElementById('resumeFormElement').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
 
  const education = document.getElementById('education').value;
  const skills = document.getElementById('skills').value;
  const experience = document.getElementById('experience').value;
  const projects = document.getElementById('projects').value;
  const certifications = document.getElementById('certifications').value;
  const hobbies = document.getElementById('hobbies').value;
  /*const profileFile = document.getElementById('profile').files[0];

  let profileURL = "";
  if (profileFile) {
    const storageRef = ref(storage, 'profiles/' + profileFile.name);
    await uploadBytes(storageRef, profileFile);
    profileURL = await getDownloadURL(storageRef);
  }
*/
  await addDoc(collection(db, "resume"), {
    name, email, phone, education, skills,projects, experience, certifications, hobbies
  });

  
  document.getElementById('resumeForm').style.display = 'none';
  document.getElementById('generatedResume').style.display = 'block';

  
  document.getElementById('name').textContent = name;
  document.getElementById('email').textContent = email;
  document.getElementById('phone').textContent = phone;
 
  document.getElementById('education').textContent = education;
  document.getElementById('skills').textContent = skills;
 /* document.getElementById('resumeProfilePic').src = profileURL || '';*/
 document.getElementById('downloadResumeBtn').onclick = function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const resumeElement = document.getElementById('generatedResume');
  const downloadBtn = document.getElementById('downloadResumeBtn');
const heading = document.getElementById('heading');
  // Hide the download button before capturing
  downloadBtn.style.display = 'none';
heading.style.display = 'none';
  html2canvas(resumeElement).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = (canvas.width * 25.4) / 96; 
    const pdfHeight = (canvas.height * 25.4) / 96;
    const doc = new jsPDF({
      orientation: pdfWidth > pdfHeight ? 'l' : 'p',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });
    doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    doc.save("resume.pdf");

    heading.style.display = 'block';
    downloadBtn.style.display = 'block';
  });
};
 
});

const fieldIds = ['name', 'email', 'phone',  'education', 'skills','experience', 'projects', 'certifications', 'hobbies'];


document.getElementById('createResumeBtn').addEventListener('click', () => {
  document.getElementById('progressBarContainer').style.display = 'block';
  updateFormProgressBar();
});


function updateFormProgressBar() {
  let filled = 0;
  fieldIds.forEach(id => {
    const el = document.getElementById(id);
    if ( el.value!== ''){
       filled++; }
  });
  const percent = Math.round((filled / fieldIds.length) * 100);
  const bar = document.getElementById('progressBar');
  bar.style.width = percent + '%';
  bar.textContent = percent + '%';
  bar.setAttribute('aria-valuenow', percent);
}

fieldIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', updateFormProgressBar);
  }
});
document.querySelectorAll('.template-option').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const value = this.getAttribute('data-value');
    document.getElementById('templateSelect').value = value;
    document.getElementById('templateDropdownBtn').textContent = this.textContent;
  });
});
function showResumeTemplate(data, template) {
  document.getElementById('resumeTemplate1').style.display = 'none';
  document.getElementById('resumeTemplate2').style.display = 'none';

  if (template === 'template1') {
    document.getElementById('t1Name').textContent = data.name;
    document.getElementById('t1Email').textContent = data.email;
    document.getElementById('t1Phone').textContent = data.phone;
    document.getElementById('t1Education').textContent = data.education;
    document.getElementById('t1Skills').textContent = data.skills;
    document.getElementById('t1Experience').textContent = data.experience;
    document.getElementById('t1Projects').textContent = data.projects;
    document.getElementById('t1Certifications').textContent = data.certifications;
    document.getElementById('t1Hobbies').textContent = data.hobbies;
    document.getElementById('resumeTemplate1').style.display = 'block';
  } else {
    document.getElementById('resumeProfilePict2').src = profilePicDataUrl || "";
    document.getElementById('t2Name').textContent = data.name;
    document.getElementById('t2Email').textContent = data.email;
    document.getElementById('t2Phone').textContent = data.phone;
    document.getElementById('t2Education').textContent = data.education;
    document.getElementById('t2Experience').textContent = data.experience;

    
    function renderList(id, items) {
      const ul = document.getElementById(id);
      ul.innerHTML = "";
      items.forEach(item => {
        if (item.trim()) {
          const li = document.createElement("li");
          li.textContent = item.trim();
          ul.appendChild(li);
        }
      });
    }

  
    const projectsArr = data.projects.split(/[\n,]+/);
    const certificationsArr = data.certifications.split(/[\n,]+/);
    const hobbiesArr = data.hobbies.split(/[\n,]+/);

    renderList('t2Projects', projectsArr);
    renderList('t2Certifications', certificationsArr);
    renderList('t2Hobbies', hobbiesArr);
    renderList('t2Skills', data.skills.split(/[\n,]+/));
    renderList('t2Experience', data.experience.split(/[\n,]+/));

    document.getElementById('resumeTemplate2').style.display = 'block';
  }
}

document.getElementById('resumeFormElement').addEventListener('submit', function(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    education: document.getElementById('education').value,
    skills: document.getElementById('skills').value,
    experience: document.getElementById('experience').value,
    projects: document.getElementById('projects').value,
    certifications: document.getElementById('certifications').value,
    hobbies: document.getElementById('hobbies').value
  };
  

  const template = document.getElementById('templateSelect').value;
  showResumeTemplate(data, template);
});
