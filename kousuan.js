let body = $response.body;

// 将响应内容格式化为 JSON 对象
let jsonBody;
try {
    jsonBody = JSON.parse(body);
} catch (e) {
    console.log("Error parsing JSON: " + e);
    $done({body});
}

// 提取每个题目的答案
if (jsonBody && jsonBody.examVO && jsonBody.examVO.questions) {
    let questions = jsonBody.examVO.questions;
    
    // 构建答案列表，按批次分10个题目一组
    let answerMessages = [];
    let batchSize = 10;
    
    // 分批次处理答案
    for (let i = 0; i < questions.length; i += batchSize) {
        let batch = questions.slice(i, i + batchSize).map((q, index) => {
            return (i + index + 1) + ". [" + q.answers[0] + "]";
        }).join(" ");
        answerMessages.push(batch);
    }

    // 按批次延时展示答案，每批间隔8秒
    answerMessages.forEach((msg, index) => {
        setTimeout(() => {
            $notify("题目答案", "第 " + (index + 1) + " 批次", msg);
        }, 8000 * (index + 1));  // 每批次间隔 8 秒
    });
}

// 返回原始响应内容
$done({body});
