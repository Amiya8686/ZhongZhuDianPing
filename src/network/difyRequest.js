import { difyConfig } from '@/config/difyRequestConfig'

/** foodConsutlt流式请求：
 * @param {string} query - 用户的输入文本
 * @param {string} conversationId - 会话 ID (首轮对话留空)
 * @param {Function} onChunk - 蹦字回调函数
 */
const chatNetworkStream = (query, conversationId = '', onChunk) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseUrl = difyConfig.baseUrl; 
      const appParam = difyConfig.apps.foodConsultant; 

      // 🔴 客户端标准请求：直接向基地址发请求，用查询参数拼上 ?app=foodConsultant
      const response = await fetch(`${baseUrl}?app=${appParam}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: query,
          response_mode: 'streaming',
          conversation_id: conversationId,
          user: 'student_demo_user'
        })
      });

      if (!response.ok) {
        throw new Error(`业务服务器转发失败,HTTP状态码: ${response.status}`);
      }

      // ---- 底层 SSE 流式响应解析逻辑 ----
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      // 🌟 动态自适应状态控制变量
      let isGateOpen = false;         // 核心放行闸门：是否允许向外部 onChunk 蹦字
      let preThinkBuffer = '';        // 前置观察缓冲区

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); 

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const dataJson = JSON.parse(line.slice(5).trim());
              
              if (dataJson.event === 'text_chunk' || dataJson.event === 'agent_message') {
                const text = dataJson.answer || dataJson.text || '';
                
                if (text) {
                  if (isGateOpen) {
                    // ✅ 状态 1：闸门已开（不管是跨越了 </think> 还是原本就没有 think），直接流式蹦字
                    if (onChunk) {
                      onChunk(text);
                    }
                  } else {
                    // 🔒 状态 2：闸门关闭状态，处于初始观察期
                    preThinkBuffer += text;

                    // 1. 情况一：流中包含了 <think> 标签，开启“深度思考过滤模式”
                    if (preThinkBuffer.includes('<think>')) {
                      const endTag = '</think>';
                      const endTagIdx = preThinkBuffer.indexOf(endTag);
                      
                      if (endTagIdx !== -1) {
                        // 🚀 终于看到了结束标签，立马破局开启闸门
                        isGateOpen = true;
                        const remainingText = preThinkBuffer.substring(endTagIdx + endTag.length);
                        if (onChunk && remainingText) {
                          onChunk(remainingText);
                        }
                        preThinkBuffer = ''; // 释放内存
                      }
                      // 只要还没看到 </think>，这里就什么都不做，前端继续静止保持“安检”
                    } 
                    // 2. 情况二：数据包不断累加，但一直没有出现 "<think>" 字符串
                    // 如果缓冲区长度已经超过了 `<think>` 标签可能产生残缺的最大期望长度（例如 10 个字符）且没有包含 <think>
                    // 说明该模型是标准直出模型，压根没有思考链，直接开闸放行
                    else if (preThinkBuffer.length >= 10) {
                      isGateOpen = true;
                      if (onChunk && preThinkBuffer) {
                        onChunk(preThinkBuffer); // 把观察期积压的正常正文一口气吐给前端
                      }
                      preThinkBuffer = ''; // 释放内存
                    }
                  }
                }
              }
              
              if (dataJson.event === 'message_end') {
                // 🛠️ 容错保护：万一极其特殊的情况下，模型只返回了极短的内容就直接 message_end 且没开闸
                if (!isGateOpen && preThinkBuffer && !preThinkBuffer.includes('<think>')) {
                  if (onChunk) onChunk(preThinkBuffer);
                }
                resolve(dataJson.conversation_id); 
              }
            } catch (e) {
              // 忽略行尾解析不全导致的异常
            }
          }
        }
      }
    } catch (error) {
      console.error('[Dify流式通信异常]:', error);
      reject(error);
    }
  });
}

/** 🔮 智能评论生成多轮交互函数
 * @param {Object} messages - 本轮发送的业务对象 (内部自动执行 JSON 序列化)
 * @param {string} conversationID - 会话 ID (首轮对话传空字符串 "")
 * @returns {Promise<Object>} 清洗及反序列化后的纯 JavaScript 业务数据对象
 */
const interactMagicPot = (messages, conversationID = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseUrl = difyConfig.baseUrl; 
      const appParam = difyConfig.apps.intelligentCommentGeneration; 

      // 1. 自动序列化：将传入的业务对象转换为符合传输契约的 JSON 字符串
      const serializedQuery = JSON.stringify(messages);

      // 2. 发起标准的 Dify 后端请求
      const response = await fetch(`${baseUrl}?app=${appParam}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: serializedQuery,
          response_mode: 'streaming',
          conversation_id: conversationID,
          user: 'student_demo_user'
        })
      });

      if (!response.ok) {
        throw new Error(`智能评论生成请求失败, HTTP状态码: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let accumulatedText = ''; // 累加所有的文本 Chunk
      let finalConversationID = conversationID;
      let buffer = '';

      // 3. 多生命周期流式接收与累加
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const dataJson = JSON.parse(line.slice(5).trim());
              
              // 提取文本块或 Agent 消息
              if (dataJson.event === 'text_chunk' || dataJson.event === 'agent_message') {
                const text = dataJson.answer || dataJson.text || '';
                if (text) {
                  accumulatedText += text;
                }
              }

              // 记录最终会话 ID
              if (dataJson.conversation_id) {
                finalConversationID = dataJson.conversation_id;
              }
            } catch (e) {
              // 忽略解析单行不完整导致的异常
            }
          }
        }
      }

      // 4. 数据高防清洗与反序列化
      let cleanedText = accumulatedText.trim();

      // 防御 A：物理剔除深度思考模型可能夹杂的思考内容 <think>...</think>
      cleanedText = cleanedText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      // 防御 B：稳健剥离大模型输出可能附带的 Markdown 代码块标记 (```json ... ```)
      const markdownRegex = /```json\s*([\s\S]*?)\s*```/;
      const match = cleanedText.match(markdownRegex);
      let jsonStr = match ? match[1].trim() : cleanedText;

      // 防御 C：物理绝杀大写 Python 风格的 True/False，强行转回 JS 标准全小写布尔值
      jsonStr = jsonStr
        .replace(/:\s*True\b/g, ': true')
        .replace(/:\s*False\b/g, ': false');

      // 5. 最终反序列化解析并 Resolve 返回
      try {
        const parsedData = JSON.parse(jsonStr);
        resolve({
          conversationID: finalConversationID,
          data: parsedData
        });
      } catch (parseError) {
        // 如果因极致异常导致 JSON 无法解析，在此处进行优雅业务兜底，防止前端渲染崩塌
        console.error('[MagicPot JSON清洗解析失败]:', parseError, '原始文本:', accumulatedText);
        reject(new Error('魔法评论数据清洗解析异常'));
      }

    } catch (error) {
      console.error('[MagicPot 通信异常]:', error);
      reject(error);
    }
  });
}

export { chatNetworkStream, interactMagicPot }
