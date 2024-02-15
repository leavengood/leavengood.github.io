function getDiceRoll() {
    var buf = new Uint8Array(5);
    crypto.getRandomValues(buf);

    for (i in buf) {
        var roll = (buf[i] % 6) + 1;
        buf[i] = roll;
    }

    return buf;
}

function getNumbers(count) {
    var buf = new Uint8Array(count * 10);
    crypto.getRandomValues(buf);

    const numMap = new Map();
    for (i in buf) {
        var num = buf[i] % 10;
        if (!numMap.has(num)) {
            numMap.set(num, true);
        }
        if (numMap.size == count) {
            break;
        }
    }

    return numMap;
}

const symbols = "!@#$%^&*-+=;:";

function getSymbols(count) {
    var buf = new Uint8Array(count * 10);
    crypto.getRandomValues(buf);

    const symMap = new Map();
    for (i in buf) {
        var sym = symbols[buf[i] % symbols.length];
        if (!symMap.has(sym)) {
            symMap.set(sym, true);
        }
        if (symMap.size == count) {
            break;
        }
    }

    return symMap;
}

function rollToString(roll) {
    result = "";

    for (i in roll) {
        result += roll[i].toString();
    }

    return result;
}

async function getWordList() {
    const response = await fetch("/eff_large_wordlist.txt");
    const wordlist = await response.text();
    return wordlist;
}

function findWord(wordlist, number) {
    const index = wordlist.search(number)
    const newlineIndex = wordlist.indexOf("\n", index);
    return wordlist.slice(index, newlineIndex);
}

function generate() {
    getWordList().then(wordlist => {
        const start = Date.now();

        const numWords = 10;
        var wordsHTML = "";
        for (var i = 0; i < numWords; i++) {
            const roll = getDiceRoll();
            const rollStr = rollToString(roll);
            const word = findWord(wordlist, rollStr);
            console.log(word);
            wordsHTML += word + "<br/>";
        }
        document.getElementById("words").innerHTML = wordsHTML;

        var numbersHTML = "";
        const nums = getNumbers(3);
        console.log(nums)
        for (const num of nums) {
            numbersHTML += `Number: ${num[0]}<br/>`;
        }
        document.getElementById("numbers").innerHTML = numbersHTML;

        var symbolsHTML = "";
        const symbols = getSymbols(5);
        console.log(symbols);
        for (const sym of symbols) {
            symbolsHTML += `Symbol: ${sym[0]}<br/>`;
        }
        document.getElementById("symbols").innerHTML = symbolsHTML;

        const end = Date.now();
        console.log(`Execution time: ${end - start} ms`);
    });
}

document.addEventListener("load", generate());