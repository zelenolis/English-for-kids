import cards from './cards.js';
// creating key-value set
// 0s0s0 means: first 0 - train mode click, second 0 - game mode right click, third 0 - game mode wrong click. s - is simple divider

// Creating new local storage, if not created yet

export function creatingLocalStorage(argument) {
	for (let i = 1; i < 9; i++) {
		for (let k = 0; k < 8; k++) {
			if (!localStorage.getItem(cards[i][k]["word"])) {
				localStorage.setItem(cards[i][k]["word"], "0s0s0");
			}			
		}
	}
}

//Clearing local storage

export function clearLocalStorage() {
	for (let i = 1; i < 9; i++) {
		for (let k = 0; k < 8; k++) {
			localStorage.setItem(cards[i][k]["word"], "0s0s0");
		}
	}
}

// clicks control

export function setTrain(setName, index) {
	let counter = localStorage.getItem(cards[setName][index]["word"]).split('s');
	counter[0] = +counter[0] + 1;
	let newCounter = counter.join('s');
	localStorage.setItem(cards[setName][index]["word"], newCounter);
}

export function setCorrect(setName, index) {
	let counter = localStorage.getItem(cards[setName][index]["word"]).split('s');
	counter[1] = +counter[1] + 1;
	let newCounter = counter.join('s');
	localStorage.setItem(cards[setName][index]["word"], newCounter);
}

export function setWrong(setName, index) {
	let counter = localStorage.getItem(cards[setName][index]["word"]).split('s');
	counter[2] = +counter[2] + 1;
	let newCounter = counter.join('s');
	localStorage.setItem(cards[setName][index]["word"], newCounter);
}

export function sortByName(argument) {
	let sortBy = wordArrays();
	if (argument) {return sortBy.sort((a, b) => a.word < b.word ? 1 : -1);}
	return sortBy.sort((a, b) => a.word > b.word ? 1 : -1);
}
export function sortByTranslation(argument) {
	let sortBy = wordArrays();
	if (argument) {return sortBy.sort((a, b) => a.translation < b.translation ? 1 : -1);}
	return sortBy.sort((a, b) => a.translation > b.translation ? 1 : -1);
}
export function sortByTrainClicks(argument) {
	let sortBy = wordArrays();
	if(argument) {
		return sortBy.sort((a, b) => {
			if (a["clicks in train mode"] === 0) return 1;
			if (b["clicks in train mode"] === 0) return -1;
			return a["clicks in train mode"] - b["clicks in train mode"];
		});
	}
	return sortBy.sort((a, b) => {
		if (a["clicks in train mode"] === 0) return 1;
		if (b["clicks in train mode"] === 0) return -1;
		return b["clicks in train mode"] - a["clicks in train mode"];
	});
}
export function sortByPlayclicks(argument) {
	let sortBy = wordArrays();
	if(argument) {
		return sortBy.sort((a, b) => {
			if (a["correct answers"] === 0) return 1;
			if (b["correct answers"] === 0) return -1;
			return a["correct answers"] - b["correct answers"];
		});
	}
	return sortBy.sort((a, b) => {
		if (a["correct answers"] === 0) return 1;
		if (b["correct answers"] === 0) return -1;
		return b["correct answers"] - a["correct answers"];
	});
}
export function sortByErrors(argument) {
	let sortBy = wordArrays();
	if(argument) {
		return sortBy.sort((a, b) => {
			if (a["wrong answers"] === 0) return 1;
			if (b["wrong answers"] === 0) return -1;
			return a["wrong answers"] - b["wrong answers"];
		});
	}
	return sortBy.sort((a, b) => {
		if (a["wrong answers"] === 0) return 1;
		if (b["wrong answers"] === 0) return -1;
		return b["wrong answers"] - a["wrong answers"];
	});
}
export function sortByPercent(argument) {
	let sortBy = wordArrays();
	if(argument) {
		return sortBy.sort((a, b) => {
			if (a["% of correct answers"] === 0) return 1;
			if (b["% of correct answers"] === 0) return -1;
			return a["% of correct answers"] - b["% of correct answers"];
		});
	}
	return sortBy.sort((a, b) => {
		if (a["% of correct answers"] === 0) return 1;
		if (b["% of correct answers"] === 0) return -1;
		return b["% of correct answers"] - a["% of correct answers"];
	});
}

// creating array of words
export function wordArrays() {
	let wordArray = [];
	for (let i = 1; i < 9; i++) {
		for (let k = 0; k < 8; k++) {
			let currentObject = {};
			let currentWord = cards[i][k]["word"];
			let counter = localStorage.getItem(cards[i][k]["word"]).split('s');
			let train = +counter[0];
			let correct = +counter[1];
			let wrong = +counter[2];
			let percent = Math.floor(correct * 100 / (correct + wrong));
			if (correct === 0) {percent = 0}
			currentObject["word"] = currentWord;
			currentObject["translation"] = cards[i][k]["translation"];
			currentObject["clicks in train mode"] = train;
			currentObject["correct answers"] = correct;
			currentObject["wrong answers"] = wrong;
			currentObject["% of correct answers"] = percent;
			wordArray.push(currentObject);
		}
	}
	return wordArray;
}

export function checkHardWords() {
	let sortBy = wordArrays();
	sortBy.sort((a, b) => {
		if (a["wrong answers"] === 0) return 1;
		if (b["wrong answers"] === 0) return -1;
		return a["wrong answers"] - b["wrong answers"];
	});
	if (sortBy[0]["wrong answers"] === 0) {return false}
	else {return true}
}

export function hardwords() {
	let sortBy = wordArrays();
	let hardWords = [];
	sortBy.sort((a, b) => {
		if (a["wrong answers"] === 0) return 1;
		if (b["wrong answers"] === 0) return -1;
		return a["wrong answers"] - b["wrong answers"];
	});
	for (let i = 0; i < 8; i++) {
		if (sortBy[i]["wrong answers"] === 0) {continue}
		let hardword = {};
		hardword["word"] = sortBy[i]["word"];
		hardword["translation"] = sortBy[i]["translation"];
		hardword["image"] = globalWordSearch(hardword["word"], "image");
		hardword["audioSrc"] = globalWordSearch(hardword["word"], "audioSrc");
		hardWords.push(hardword);
	}
	return hardWords;
}

export function globalWordSearch(word, type) {
	for (let i = 1; i < 9; i++) {
		for (let k = 0; k < 8; k++) {
			if (cards[i][k]["word"] === word) {
				return cards[i][k][type];
				break
			}
		}
	}
}
// export {creatingLocalStorage};
// export {setTrain};
// export {setCorrect};
// export {setWrong};