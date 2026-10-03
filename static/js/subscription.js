// Newsletter subscription form handling.
//
// A page can render more than one newsletter instance (e.g. the shortcode in
// the content plus the footer block), and each instance embeds its own copy
// of this <script> tag. That means this file can execute more than once per
// page load, and it must wire up every "*.rad-subscription-group form" that
// exists, not just the first one — each instance talks to its own form
// action and reveals its own success/fail panels, never another instance's.

const radSubscriptionRequest = (url = "", data = {}) =>
  fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Subscription request failed with status ${response.status}`,
      );
    }
    return response.json();
  });

const makeSubscriptionRequest = async (event, instance) => {
  event.preventDefault();
  const { form, emailInput, submitButton, successPanel, failPanel } = instance;

  try {
    if (submitButton) {
      submitButton.classList.add("is-loading");
    }

    // Post to the form's own action, never a hard-coded URL, so each
    // instance on the page talks to whatever endpoint it was configured with.
    const url =
      form.getAttribute("action") || form.action || window.location.href;
    await radSubscriptionRequest(url, {
      email: emailInput ? emailInput.value : "",
    });

    form.classList.add("d-none");
    if (successPanel) {
      successPanel.classList.remove("d-none");
      successPanel.classList.add("d-flex");
    }
  } catch (error) {
    form.classList.add("d-none");
    if (failPanel) {
      failPanel.classList.remove("d-none");
      failPanel.classList.add("d-flex");
    }
  } finally {
    if (submitButton) {
      submitButton.classList.remove("is-loading");
    }
  }
};

// Binds a single form, scoping every lookup (email input, submit button,
// success/fail panels) to that form's own group so one instance never reads
// or reveals another instance's elements. Guarded by a dataset flag because
// this whole script can run more than once for the same form.
const initRadSubscriptionForm = (form) => {
  if (form.dataset.radSubscriptionBound === "true") {
    return;
  }
  form.dataset.radSubscriptionBound = "true";

  const scope =
    form.closest(".rad-subscription-group") || form.closest("section") || form;

  const instance = {
    form,
    emailInput: scope.querySelector('input[type="email"]'),
    submitButton:
      scope.querySelector('button[type="submit"]') ||
      scope.querySelector('[id$="-submit"]'),
    successPanel: scope.querySelector('[id$="-success"]'),
    failPanel: scope.querySelector('[id$="-fail"]'),
  };

  form.addEventListener("submit", (event) =>
    makeSubscriptionRequest(event, instance),
  );
};

const initRadSubscription = () => {
  document
    .querySelectorAll(".rad-subscription-group form")
    .forEach(initRadSubscriptionForm);
};

if (document.readyState !== "loading") {
  initRadSubscription();
}
document.addEventListener("DOMContentLoaded", initRadSubscription);
