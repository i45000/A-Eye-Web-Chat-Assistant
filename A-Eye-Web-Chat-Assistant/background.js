chrome.commands.onCommand.addListener((command) => {
  if (command === "_execute_action") {
    console.log("Shortcut pressed!");
  }
});

const SYSTEM_PROMPT = `You are A-Eye Web Chat Assistant, a helpful web browsing assistant. Your task is to summarize web content and respond to user queries in a clear, concise, and plain text format, suitable for text-to-speech. Avoid using markdown format.

1. Summarizing Content: Provide a brief, plain text summary of the core message when summarizing web pages, suitable for text-to-speech.

2. Respond to queries as follows:
   - When asked "go to youtube / go youtube": Respond with "open https://www.youtube.com".
   - When asked "search for youtube / find youtube": Respond with "open https://www.google.com/search?q=youtube".
   - When asked "take a screenshot": Respond with "screenshot".
   - When asked "take a rolling screenshot": Respond with "rollingScreenshot".
   - When asked "summarize content / analyze content": Respond with "analyze content".

Always respond in English. Your responses must be clear, helpful, and in plain text, avoiding any formatting like markdown.`;

const ERROR_MESSAGES = {
  GEMINI_UNAVAILABLE: "Gemini Nano is not available.",
  NO_RESPONSE: "No response from Gemini",
  SESSION_FAILED: "Failed to create Gemini session"
};

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

let currentGeminiSession = null;
let isInitializing = false;

chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  if (command === 'toggle-voice-control') {
    chrome.runtime.sendMessage({
      type: 'toggleVoiceControl'
    });
  }
  if (command === 'toggle-voice-input') {
    chrome.runtime.sendMessage({
      type: 'toggleVoiceInput'
    });
  }
  if (command === 'toggle-repeat') {
    chrome.runtime.sendMessage({
      type: 'toggleRepeat'
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handlers = {
    'initGemini': () => initializeGemini(sendResponse),
    'analyze': () => initializeAndAnalyze(request.text, sendResponse),
    'chat': () => handleChat(request.text, sendResponse),
    'startScrollingScreenshot': async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => ({
            scrollHeight: document.documentElement.scrollHeight,
            clientHeight: document.documentElement.clientHeight,
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth
          })
        });

        sendResponse(results[0].result);
      } catch (error) {
        console.error('Failed to get page dimensions:', error);
        sendResponse(null);
      }
      return true;
    }
  };

  if (handlers[request.type]) {
    handlers[request.type]();
    return true;
  }
});

async function createGeminiSession() {
  if (isInitializing) {
    return { success: false, error: 'Session initialization in progress' };
  }
  
  try {
    isInitializing = true;
    
    const capabilities = await ai.languageModel.capabilities();
    if (capabilities.available === "no") {
      throw new Error(ERROR_MESSAGES.GEMINI_UNAVAILABLE);
    }

    const session = await ai.languageModel.create({
      systemPrompt: SYSTEM_PROMPT
    });

    if (!session) {
      throw new Error(ERROR_MESSAGES.SESSION_FAILED);
    }

    currentGeminiSession = session;
    return { success: true, session };
  } catch (error) {
    console.error('Gemini Session Creation Error:', error);
    return { success: false, error: error.message };
  } finally {
    isInitializing = false;
  }
}

async function ensureGeminiSession() {
  if (!currentGeminiSession) {
    const result = await createGeminiSession();
    return result.success;
  }
  return true;
}

function handleGeminiResponse(result, sendResponse) {
  if (!result) {
    sendResponse({ error: ERROR_MESSAGES.NO_RESPONSE });
    return;
  }
  sendResponse({ content: result });
}

async function initializeGemini(sendResponse) {
  try {
    const { success, error } = await createGeminiSession();
    sendResponse({ success, error });
  } catch (error) {
    console.error('Initialize Error:', error);
    sendResponse({ error: error.toString() });
  }
}

async function initializeAndAnalyze(text, sendResponse) {
  try {
    if (!await ensureGeminiSession()) {
      sendResponse({ error: ERROR_MESSAGES.GEMINI_UNAVAILABLE });
      return;
    }

    const prompt = `Summarize this web page about 100 words. Web Page Content: "${text}"`;

    const result = await currentGeminiSession.prompt(prompt);
    handleGeminiResponse(result, sendResponse);
  } catch (error) {
    console.error('Analysis Error:', error);
    sendResponse({ error: error.toString() });
  }
}

async function handleChat(text, sendResponse) {
  try {
    const sessionAvailable = await ensureGeminiSession();
    if (!sessionAvailable) {
      await createGeminiSession();
    }
    
    if (!currentGeminiSession) {
      throw new Error(ERROR_MESSAGES.GEMINI_UNAVAILABLE);
    }

    const result = await currentGeminiSession.prompt(text);
    handleGeminiResponse(result, sendResponse);
  } catch (error) {
    console.error('Chat Error:', error);
    sendResponse({ error: error.toString() });
  }
}