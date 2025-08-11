const faqArray = [
  {
    question: "How do I start designing a room?",
    answer:
      'Simply sign in and click "Create New Room" from your dashboard. You’ll be able to set custom dimensions, explore room settings, and start adding objects right away.',
  },
  {
    question: "Can I use SENSE without any design experience?",
    answer:
      "Yes! SENSE is designed to be intuitive for everyone. With drag-drop controls, categorized sensory objects, and a built-in tutorial, anyone can start designing.",
  },
  {
    question: "Is the tool free to use?",
    answer:
      "We offer a freemium model. Basic features are free to use, and advanced features like premium sensory objects, export tools, and specialized room templates are available with a subscription.",
  },
  {
    question: "Can I collaborate with others on a room?",
    answer:
      "Collaboration features are part of our upcoming premium tools. Stay tuned for exciting updates that will allow shared editing, real-time teamwork, and collaborative design feedback among users.",
  },
  {
    question: "What happens if I lose my internet connection?",
    answer:
      "If you lose internet connection, saved designs remain secure. Unsaved changes may be lost, so save frequently. Full functionality resumes once your connection is restored. Offline access is currently unsupported.",
  },
  {
    question: "How can I give feedback or request new features?",
    answer:
      "We’d love to hear from you! Use the Contact Us form in our Help Center or email us directly to suggest new features, share feedback, or report any technical issues.",
  },
];

const container = document.getElementById("faq-container");
const getCurrentYear = document.querySelector("#footer-year");

faqArray.forEach((el) => {
  const div = document.createElement("div");
  div.className =
    "col-span-1 p-5 border border-1.5 border-neutral-200 rounded-lg flex flex-col justify-between gap-2";

  const question = document.createElement("h1");
  question.className = "font-medium";
  question.textContent = el.question;

  const answer = document.createElement("p");
  answer.className = "text-[15px] text-neutral-700";
  answer.textContent = el.answer;

  div.appendChild(question);
  div.appendChild(answer);
  container.appendChild(div);
});

getCurrentYear.textContent = `© ${new Date().getFullYear()} Sense. All Rights Reserved`;