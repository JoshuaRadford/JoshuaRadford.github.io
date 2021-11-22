class Project{
  title;
  tags;
  details;
  img;
  infoLink;
  playLink;
  downloadLink;

  constructor(title, tags, details, img, infoLink, playLink, downloadLink){
      this.title = title;
      this.tags = tags;
      this.details = details;
      this.img = img;
      this.infoLink = infoLink;
      this.playLink = playLink;
      this.downloadLink = downloadLink;
  }
}

function setupProjects(){
  let p_CHG = new Project("Changeling", 
  ["UE4", "UI/UX Design", "Perforce", "Level Design"],
  "These are the details of this project.",
  "assets/images/CHG.mp4");

  let projects = [];
  projects.push(p_CHG);

  return projects;
}

export{Project, setupProjects};