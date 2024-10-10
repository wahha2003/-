// 获取服务器响应的原始数据
let body = $response.body;

// 将响应内容格式化为JSON对象
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
    
    // 构建答案列表的输出
    let answerMessage = questions.map((q, index) => {
        return (index + 1) + ". [" + q.answers[0] + "]";
    }).join(" ");
    
    // 发送弹窗，展示答案
    $notify("题目答案", "", answerMessage);
    
    console.log("Answers: " + answerMessage);  // 也可以在日志中输出
}

// 返回原始响应内容
$done({body});
