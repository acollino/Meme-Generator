const imageLinkInput = document.querySelector("#url-input");
const textTop = document.querySelector("#text-top");
const textBottom = document.querySelector("#text-bottom");
const submitButton = document.querySelector("#submit-button");
const memeContainer = document.querySelector("#meme-container");
const textToAdd = [];

submitButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (imageLinkInput.validity.valid) {
    submitButton.disabled = true;
    recordText();
    addImage();
    clearInputs();
  }
});

function addImage() {
  let url = imageLinkInput.value;
  let memeDiv = document.createElement("div");
  memeDiv.classList.add("meme-div");
  let memeImage = document.createElement("img");
  memeImage.setAttribute("src", url);
  memeImage.setAttribute("crossorigin", "anonymous");
  memeDiv.append(memeImage);
  memeImage.addEventListener("load", function (e) {
    manageCanvas(memeDiv, memeImage);
    memeImage.hidden = true;
    submitButton.disabled = false;
  });
  memeContainer.append(memeDiv);
}

function recordText() {
  textToAdd.push(textBottom.value);
  textToAdd.push(textTop.value);
}

function manageCanvas(memeDiv, memeImage) {
  let upperText = textToAdd.pop();
  let lowerText = textToAdd.pop();
  addRemoveButton(memeDiv);
  let context = addCanvas(memeDiv, memeImage.width, memeImage.height);
  context.drawImage(memeImage, 0, 0, memeImage.width, memeImage.height);
  setContextStyle(context);
  let upperArray = checkTextLength(upperText, context, memeImage.width * 0.95);
  let lowerArray = checkTextLength(lowerText, context, memeImage.width * 0.95);
  addCanvasText(upperArray, memeImage, context, 0.2);
  addCanvasText(lowerArray, memeImage, context, 0.9);
}

function setContextStyle(context) {
  context.font = "4em Impact";
  context.lineWidth = "5";
  context.lineJoin = "bevel";
  context.fillStyle = "white";
  context.textAlign = "center";
}

function addRemoveButton(memeDiv) {
  let removeButton = document.createElement("button");
  removeButton.classList.add("meme-button");
  removeButton.setAttribute("data-remove", true);
  removeButton.textContent = "Remove Meme";
  memeDiv.append(removeButton);
}

function checkTextLength(inputString, context, maxLength) {
  let outputArray = [""];
  if (context.measureText(inputString).width > maxLength) {
    let textArray = inputString.split(/\s/);
    for (let i = 0; i < textArray.length - 1; i++) {
      outputArray[outputArray.length - 1] += textArray[i];
      let lengthAfterNextString = context.measureText(
        outputArray[outputArray.length - 1]
      ).width;
      lengthAfterNextString += context.measureText(
        " " + textArray[i + 1]
      ).width;
      if (lengthAfterNextString < maxLength) {
        outputArray[outputArray.length - 1] += " ";
      } else {
        outputArray.push("");
      }
      if (i == textArray.length - 2) {
        outputArray[outputArray.length - 1] += textArray[i + 1];
      }
    }
  } else {
    outputArray[0] = inputString;
  }
  return outputArray;
}

function addCanvasText(textArray, image, context, heightRatio) {
  let ratio = heightRatio;
  if (ratio == 0.2) {
    for (let i = 0; i < textArray.length; i++) {
      context.strokeText(
        textArray[i],
        image.width * 0.5,
        image.height * ratio,
        image.width * 0.95
      );
      context.fillText(
        textArray[i],
        image.width * 0.5,
        image.height * ratio,
        image.width * 0.95
      );
      ratio += 0.2;
    }
  } else {
    for (let i = textArray.length - 1; i >= 0; i--) {
      context.strokeText(
        textArray[i],
        image.width * 0.5,
        image.height * ratio,
        image.width * 0.95
      );
      context.fillText(
        textArray[i],
        image.width * 0.5,
        image.height * ratio,
        image.width * 0.95
      );
      ratio -= 0.2;
    }
  }
}

function clearInputs() {
  imageLinkInput.value = "";
  textBottom.value = "";
  textTop.value = "";
}

function removeMeme(clickedButton) {
  clickedButton.parentElement.remove();
}

document.addEventListener("click", function (e) {
  if (e.target.getAttribute("data-remove")) {
    removeMeme(e.target);
  }
  if (e.target.getAttribute("data-URL")) {
    console.log(e.target.nextSibling.toDataURL());
  }
});

function addCanvas(parentDiv, width, height) {
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  parentDiv.append(canvas);
  return canvas.getContext("2d");
}
