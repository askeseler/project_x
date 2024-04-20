window.onload = () => {
    const go = document.getElementById("go");
    go.addEventListener("click", () => {
        alert("Hello World!");
        (async () => {
            const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
            alert(response);
        })();
    });
}
