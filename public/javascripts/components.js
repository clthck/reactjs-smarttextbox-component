window.SmartTextbox = React.createClass({

  getInitialState() {
    return {
      closeButtonImageDataUrl: "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUwIDUwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MCA1MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxjaXJjbGUgc3R5bGU9ImZpbGw6I0Q3NUE0QTsiIGN4PSIyNSIgY3k9IjI1IiByPSIyNSIvPgo8cG9seWxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDsiIHBvaW50cz0iMTYsMzQgMjUsMjUgMzQsMTYgICAiLz4KPHBvbHlsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7IiBwb2ludHM9IjE2LDE2IDI1LDI1IDM0LDM0ICAgIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=",
    };
  },

  componentDidMount() {
    var wrapper = document.querySelector('.smart-textbox'),
        textField = wrapper.querySelector('.text-field'),
        overlay = wrapper.querySelector('.overlay'),
        overlayParagraph = overlay.querySelector('p'),
        ogImageWrapper = wrapper.querySelector('.og-image-wrapper'),
        ogImage = ogImageWrapper.querySelector('.og-image'),
        ogImageCloseButton = ogImageWrapper.querySelector('.close-button'),
        imageFilesWrapper = wrapper.querySelector('.image-files'),
        metaTitle = wrapper.querySelector('.title'),
        metaDesc = wrapper.querySelector('.description'),
        allowDrop = true,
        file = null;

    // Apply styles to the component
    wrapper.style.width = '450px';
    wrapper.style.padding = '20px';
    wrapper.style.backgroundColor = 'lightgrey';
    wrapper.style.border = '2px solid lightgrey';
    wrapper.style.position = 'relative';
    textField.style.width = '100%';
    textField.style.boxSizing = 'border-box';
    textField.style.padding = '10px';
    overlay.style.position = 'absolute';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.opacity = '0.85';
    overlay.style.backgroundColor = 'white';
    overlay.style.display = 'none';
    overlayParagraph.style.textAlign = 'center';
    overlayParagraph.style.position = 'relative';
    overlayParagraph.style.top = '50%';
    overlayParagraph.style.transform = 'translateY(-50%)';
    overlayParagraph.style.margin = '0';
    overlayParagraph.style.color = 'grey';
    ogImageWrapper.style.position = 'relative';
    ogImage.style.width = '100%';
    ogImage.style.display = 'none';
    ogImageCloseButton.style.position = 'absolute';
    ogImageCloseButton.style.top = '5px';
    ogImageCloseButton.style.right = '5px';
    ogImageCloseButton.style.display = 'none';

    window.addEventListener('dragstart', (e) => {
      // Inspect drag behavior inside the current document
      allowDrop = !wrapper.contains(e.srcElement);
    }, false);

    window.addEventListener('dragover', (e) => {
      e = e || event;
      e.preventDefault();   // Prevent the current page from reloading with the dropped data
      if (allowDrop) {
        wrapper.style.border = '2px dashed grey';
        overlay.style.display = 'block';
      } else {
        overlay.style.display = 'none';
      }

      if (wrapper.contains(e.toElement)) {
        overlayParagraph.innerHTML = 'Drop Here';
      } else {
        overlayParagraph.innerHTML = 'Drag Link/Photo/Video Here';
      }
    }, false);

    window.addEventListener('drop', (e) => {
      wrapper.style.border = '2px solid lightgrey';
      e = e || event;
      e.preventDefault();   // Prevent the current page from reloading with the dropped data
      overlay.style.display = 'none';
      if (allowDrop && wrapper.contains(e.toElement)) {
        metaTitle.innerHTML = "";
        metaDesc.innerHTML = "";
        ogImage.src = "";
        ogImage.style.display = 'none';
        imageFilesWrapper.innerHTML = '';
        ogImageCloseButton.style.display = 'none';

        for (var item of e.dataTransfer.items) {
          if (item.kind == 'string' && item.type == 'text/uri-list') {
            item.getAsString( (s) => {
              textField.value = s;
              this.processURL();
            });
          } else if (item.kind == 'file') {
            // Process the data as file
            file = item.getAsFile();
            if (file.type.match(/^image\//)) {
              this.addNewImageFile(item.getAsFile(), imageFilesWrapper);
            }
          }
        }
        imageFilesWrapper.innerHTML += '<div style="clear: both;"></div>';
      }
      allowDrop = true;
    }, false);

    ogImageCloseButton.onclick = () => {
      ogImageCloseButton.style.display = 'none';
      ogImage.src = '';
      ogImage.style.display = 'none';
    };
  },

  /**
   * Add a image file that's drag-n-dropped from outside the document.
   */
  addNewImageFile(file, wrapper) {
    var fileReader = null,
        guid = this.guid(),
        imgWrapper = document.createElement('div'),
        closeButton = document.createElement('a'),
        closeButtonImage = document.createElement('img');

    imgWrapper.className = 'image-wrapper';
    imgWrapper.setAttribute('guid', guid);
    imgWrapper.style.float = 'left';
    imgWrapper.style.width = '72px';
    imgWrapper.style.height = '72px';
    imgWrapper.style.border = '2px solid grey';
    imgWrapper.style.marginRight = '5px';
    imgWrapper.style.backgroundColor = 'lightgrey';
    imgWrapper.style.backgroundSize = 'cover';
    imgWrapper.style.backgroundRepeat = 'no-repeat';
    imgWrapper.style.backgroundPosition = 'center';
    imgWrapper.style.position = 'relative';
    closeButtonImage.src = this.state.closeButtonImageDataUrl;
    closeButtonImage.style.width = '20px';
    closeButton.href = 'javascript:void(0)';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.className = 'close-button';
    closeButton.appendChild(closeButtonImage);
    imgWrapper.appendChild(closeButton);
    wrapper.appendChild(imgWrapper);

    fileReader = new FileReader();
    fileReader.addEventListener('load', (e, data) => {
      imgWrapper = wrapper.querySelector('[guid="' + guid + '"]');
      imgWrapper.style.backgroundImage = 'url(' + fileReader.result + ')';
      closeButton = imgWrapper.querySelector('.close-button');
      closeButton.onclick = () => wrapper.removeChild(imgWrapper);
    });
    fileReader.readAsDataURL(file);
  },

  /**
   * Generate GUID.
   */
  guid() {
    var s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  },

  /**
   * Intercept paste (⌘+V or ^+V) to trigger processURL().
   */
  handlePaste(e) {
    var wrapper = document.querySelector('.smart-textbox'),
        elTitle = wrapper.querySelector('.title'),
        elDesc = wrapper.querySelector('.description'),
        elImg = wrapper.querySelector('.og-image'),
        elImageFiles = wrapper.querySelector('.image-files'),
        ogImageCloseButton = wrapper.querySelector('.og-image-wrapper .close-button');

    elTitle.innerHTML = "";
    elDesc.innerHTML = "";
    elImg.src = "";
    elImg.style.display = 'none';
    elImageFiles.innerHTML = '';
    ogImageCloseButton.style.display = 'none';

    setTimeout(this.processURL, 300);
  },

  /**
   * Process URL to retrieve title, description and open graph image.
   */
  processURL() {
    var wrapper = document.querySelector('.smart-textbox'),
        url = wrapper.querySelector('.text-field').value,
        elTitle = wrapper.querySelector('.title'),
        elDesc = wrapper.querySelector('.description'),
        elImg = wrapper.querySelector('.og-image'),
        ogImageCloseButton = wrapper.querySelector('.og-image-wrapper .close-button'),
        yqlUrl = "http://query.yahooapis.com/v1/public/yql",
        htmlDoc = null,
        headTag = null,
        contentType = '';

    if (url.match(/^(?:http|https):\/\/\w/) == null) return;

    $.getJSON(yqlUrl, {
      format: 'json',
      env: 'http://datatables.org/alltables.env',
      q: "select * from data.headers where url='" + url + "'"
    }, (data) => {
      if (data.query.results) {
        contentType = data.query.results.resources.headers.result['content-type'];
        if (contentType.match(/^text\/html/)) {
          // if content-type is "text/html"
          htmlDoc = document.implementation.createHTMLDocument('');
          htmlDoc.documentElement.innerHTML = data.query.results.resources.content;
          headTag = htmlDoc.querySelector('head');
          var _elTitle = headTag.querySelector('title'),
              _elDesc = headTag.querySelector('meta[name="description"]'),
              _elImg = headTag.querySelector('meta[property="og:image"]'),
              _elUrl = headTag.querySelector('meta[property="og:url"]');

          if (_elTitle) {
            elTitle.innerHTML = _elTitle.innerHTML;
          }
          if (_elDesc) {
            elDesc.innerHTML = _elDesc.attributes['content'].value;
          }
          if (_elImg) {
            var imageUrl = _elImg.attributes['content'].value;
            if (imageUrl.match(/^(?:http|https):\/\/\w/)) {
              elImg.src = imageUrl;
            } else {
              elImg.src = _elUrl.attributes['content'].value + imageUrl;
            }
            elImg.style.display = 'inline';
            ogImageCloseButton.style.display = 'block';
          }
        } else if (contentType.match(/^image\//)) {
          // if content-type is "image/xxx"
          elImg.src = data.query.results.resources.url;
          elImg.style.display = 'inline';
          ogImageCloseButton.style.display = 'block';
        }
      }
    });
  },

  /**
   * Render the component.
   */
  render() {
    return(
      <div className="smart-textbox">
        <input type="text" className="text-field" placeholder="Write a comment & upload image..." onPaste={this.handlePaste} />
        <div className="meta-data">
          <h3 className="title"></h3>
          <p className="description"></p>
          <div className="og-image-wrapper">
            <img className="og-image" src="" />
            <a className="close-button" href='javascript:void(0)'>
              <img src={this.state.closeButtonImageDataUrl} width="20px" />
           </a>
          </div>
        </div>
        <div className="image-files">
        </div>
        <div className="overlay">
          <p></p>
        </div>
      </div>
    );
  }

});
