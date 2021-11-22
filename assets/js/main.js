import * as projects from "./projects.js";

//Queries
const projectsSection = document.querySelector(".projects-container");
const scrollUp = document.querySelector("#scroll-up");

//Event Listeners
scrollUp.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

function init(){

}

let myProjects = projects.setupProjects();


myProjects.forEach(p => {
  let pContainer = document.createElement("div");
  let pVidCont = document.createElement("video");
  let pVid = document.createElement("source");
  let pTitle = document.createElement("h2");
  let pDetails = document.createElement("p");

  pContainer.classList.add("project-container", "project-card");
  pVidCont.className = "project-pic"; pVidCont.muted = true; pVidCont.loop = true;
  pVidCont.addEventListener("mouseover", function() {
    this.play();
  });
  pVidCont.addEventListener("mouseleave", function() {
    this.pause(); this.currentTime = 0;
  });
  pVid.src = p.img; pVid.type = "video/mp4";
  pTitle.innerText = p.title;
  pDetails.className = "project-details";
  pDetails.innerText = p.details;

  pVidCont.appendChild(pVid);
  pContainer.appendChild(pTitle);
  pContainer.appendChild(pVidCont);
  pContainer.appendChild(pDetails);

  projectsSection.appendChild(pContainer);
});

export{init};
