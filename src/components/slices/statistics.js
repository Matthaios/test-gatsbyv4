import React from "react";

export default function Statistics({ data }) {
  return data.items && data.items.length > 0 ? (
    <section className="bg-primary-dark section-t-0">
      <div className="container py-16">
        <div className="flex phone:flex-col tablet:justify-evenly  justify-around flex-wrap lg:space-x-10">
          {data.items.map((item) => {
            return (
              <div
                key={item.label}
                className="tablet:text-center my-6 tablet:mx-8"
              >
                <div className="tablet:text-4xl  text-5xl font-semibold mb-2">
                  {item.numbers}
                </div>
                <div className="opacity-75">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  ) : null;
}
