async function sendData1() {
  console.log('sending 1 xd')
  let fileInput = document.querySelector('#file1')
  console.log(fileInput)
  console.log(fileInput.files[0])

  const formData  = new FormData();
  formData.append("file", fileInput.files[0]);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/debug/up/stuff1", true);
  xhr.send(formData);
}

async function sendData2() {
  console.log('sending 2 xd')
  let fileInput = document.querySelector('#file2')
  console.log(fileInput)
  console.log(fileInput.files[0])

  const formData  = new FormData();
  formData.append("file2", fileInput.files[0]);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/debug/up/stuff2", true);
  xhr.send(formData);
}

async function imageRun () {
  sendData1()
  sendData2()
}