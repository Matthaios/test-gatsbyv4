import get from "lodash/get";
import React from "react";

export default function ContactForm({ data }) {
  const text = get(data, "primary.text.html", "");
  return (
    <>
      <section>
        <div className="container">
          <div
            className="mx-auto text-center max-w-3xl prose"
            dangerouslySetInnerHTML={{ __html: text }}
          ></div>
          {/*<form
            name="contact"
            method="POST"
            netlify-honeypot="bot-field"
            data-netlify="true"
            className="row mx-auto my-10  max-w-3xl primary"
          >
          <p class="hidden">
              <input type="hidden" name="form-name" value="contact" />
              <label>
                Don’t fill this out if you're human: <input name="bot-field" />
              </label>
            </p>
          */}
          <form
            action="https://epikgg.typeform.com/to/HtLM4W9m"
            method="get"
            className="row mx-auto my-10  max-w-3xl primary"
          >
            <div className="col w-full md:w-1/2">
              {" "}
              <input
                type="text"
                placeholder="Your name"
                id="name"
                name="name"
                required
              />
            </div>
            <div className="col w-full md:w-1/2 phone:mt-8">
              {" "}
              <input
                type="email"
                placeholder="Your email"
                name="email"
                id="email"
                required
              />
            </div>
            <div className="col w-full  mt-8">
              <input
                type="text"
                placeholder="Subject"
                name="subject"
                id="subject"
                required
              />
            </div>
            <div className="col w-full  mt-8">
              {" "}
              <textarea
                required
                className="p-4 placeholder"
                placeholder="Your message..."
                name="message"
                id="message"
              />
            </div>

            <div className="col w-full text-center mt-8">
              <button type="submit">Send message</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
