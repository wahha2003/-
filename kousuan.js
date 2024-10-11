let body = $response.body;

let jsonBody;
try {
    jsonBody = JSON.parse(body);
} catch (e) {
    console.log("Error parsing JSON: " + e);
    $done({body});
}

if (jsonBody && jsonBody.examVO && jsonBody.examVO.questions) {
    let questions = jsonBody.examVO.questions;

    // 提取每个题目的答案
    let answers = questions.map(q => q.answers[0]);

    // 按批次处理答案，每批 10 个题目
    const batchSize = 10;
    function showAnswersByBatch(index, ans, size, delayMs) {
        try {
            let batchAnswers = ans.slice(index, index + size).map((answer, innerIndex) => {
                return (innerIndex + index + 1) + ". [" + answer + "]";
            });
            let answerMessage = batchAnswers.join(" ");
            $notify.post("题目答案", "", answerMessage);
            console.log("Answers: " + answerMessage);
            if (index + size < ans.length) {
                let startTime = Date.now();
                while (Date.now() - startTime < delayMs) {
                    // 等待直到满足延迟时间
                }
                showAnswersByBatch(index + size, ans, size, delayMs);
            }
        } catch (error) {
            console.log("Error in showing answers by batch at index " + index + ": " + error);
        }
    }

    showAnswersByBatch(0, answers, batchSize, 10000);
} else {
    console.log("No valid exam data found.");
}

$done({body});
