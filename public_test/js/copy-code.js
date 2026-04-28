/**
 * Copy code block functionality
 * Adds click handlers to copy buttons in code block wrappers
 */
(function() {
  'use strict';

  function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-code-btn');

    copyButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const wrapper = btn.closest('.highlight-wrapper');
        if (!wrapper) return;

        const codeBlock = wrapper.querySelector('code');
        if (!codeBlock) return;

        const code = codeBlock.textContent;

        // Use Clipboard API if available, fallback to execCommand
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(function() {
            showCopiedFeedback(btn);
          }).catch(function(err) {
            console.error('Failed to copy code:', err);
            fallbackCopy(code, btn);
          });
        } else {
          fallbackCopy(code, btn);
        }
      });
    });
  }

  function fallbackCopy(text, btn) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      showCopiedFeedback(btn);
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textArea);
  }

  function showCopiedFeedback(btn) {
    var copyText = btn.querySelector('.copy-text');
    var originalText = copyText ? copyText.textContent : 'Copy';

    btn.classList.add('copied');
    if (copyText) {
      copyText.textContent = 'Copied!';
    }

    setTimeout(function() {
      btn.classList.remove('copied');
      if (copyText) {
        copyText.textContent = originalText;
      }
    }, 2000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
  } else {
    initCopyButtons();
  }
})();
