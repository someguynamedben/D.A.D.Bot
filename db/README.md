To generate:

(1) Go to crunchyroll **NOTICE - MUST BE OLD UI**
(2) Paste this command into the Chrome dev console:

```javascript
(async ()=>{
  const coverDiv = document.createElement('div');
  coverDiv.style.position='absolute';
  coverDiv.style.top = 0;
  coverDiv.style.bottom = 0;
  coverDiv.style.left = 0;
  coverDiv.style.right = 0;
  coverDiv.style.opacity=0.92;
  coverDiv.style.backgroundColor='#ADD8E6';
  coverDiv.style.display='flex';
  coverDiv.style.alignItems='center';
  coverDiv.style.justifyContent='center';
  coverDiv.style.flexDirection='column';
  coverDiv.style.zIndex = 100;
  document.body.appendChild(coverDiv);

  const hdr = document.createElement('h1');
  hdr.innerText='Loading...';
  hdr.style.fontSize='48pt';
  coverDiv.appendChild(hdr);

  const prefixList = [..."abcdefghijklmnopqrstuvwxyz".split(''), "numeric"];

  const progressSpan = document.createElement('span');
  coverDiv.appendChild(progressSpan);
  let complete = 0;
  const setProgress = () => {progressSpan.innerText = `${complete} / ${prefixList.length}`};
  setProgress();

  let results = [];
  for (let prefixIdx = 0; prefixIdx < prefixList.length; prefixIdx++) {
    const prefix = prefixList[prefixIdx];
    // Iterate synchronously to avoid freaking out any sort of rate limiting Crunchyroll might have
    const url = `https://www.crunchyroll.com/videos/anime/alpha?group=${prefix}`;
    try {
      const response = await fetch(url);
      const text = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const listParent = doc.querySelector('ul.landscape-grid');
      const listChildren = [...listParent.querySelectorAll('li')];
      for (let listIdx = 0; listIdx < listChildren.length; listIdx++) {
        const child = listChildren[listIdx];
        results.push({
          title: child.querySelector('div.series-info.left span').innerText.replaceAll('"', '""'),
          href: child.querySelector('a').href,
        });
      }
    } catch (e) {
      console.error(`Failed to get anime starting with "${prefix}" - skipping!`, e)
    }

    // Delay to not look too much like a robot (probably unnecessary)
    await new Promise((resolve)=>setTimeout(resolve, 125));
    setProgress(complete++);
  }

  progressSpan.innerText = `Scraping complete! ${results.length} anime processed`;

  const textArea = document.createElement('textarea');
  textArea.value = results.map(rslJson => `"${rslJson.title}",${rslJson.href}`).join('\n');
  textArea.style.width='80%';
  textArea.style.height='45%';
  coverDiv.appendChild(textArea);

  const copyButton = document.createElement('button');
  const closeButton = document.createElement('button');
  copyButton.onclick = () => {
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    navigator.clipboard.writeText(textArea.value);
  };
  closeButton.onclick = () => {
    document.body.removeChild(coverDiv);
  };
  copyButton.style.margin='15px';
  closeButton.style.margin='15px';
  copyButton.innerText='Copy';
  closeButton.innerText='Close';
  coverDiv.appendChild(copyButton);
  coverDiv.appendChild(closeButton);
})();
```

(3) Copy the results and save as a file in this directory called `anime-list.csv`
