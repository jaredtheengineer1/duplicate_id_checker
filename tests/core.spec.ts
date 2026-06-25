import { describe, it, expect, beforeEach } from "vitest";
import { findDuplicateIds } from "../src/core";

describe("findDuplicateIds", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("returns an empty array when there are no IDs", () => {
    document.body.innerHTML = "<div><span></span></div>";
    expect(findDuplicateIds()).toEqual([]);
  });

  it("returns an empty array when all IDs are unique", () => {
    document.body.innerHTML = `
      <div id="foo"></div>
      <div id="bar"></div>
      <div id="baz"></div>
    `;
    expect(findDuplicateIds()).toEqual([]);
  });

  it("detects a simple duplicate", () => {
    document.body.innerHTML = `
      <div id="foo"></div>
      <div id="foo"></div>
    `;
    const results = findDuplicateIds();
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("foo");
    expect(results[0].elements).toHaveLength(2);
  });

  it("includes all occurrences when an ID appears more than twice", () => {
    document.body.innerHTML = `
      <div id="foo"></div>
      <div id="foo"></div>
      <div id="foo"></div>
    `;
    const results = findDuplicateIds();
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("foo");
    expect(results[0].elements).toHaveLength(3);
  });

  it("detects multiple sets of duplicates", () => {
    document.body.innerHTML = `
      <div id="foo"></div>
      <div id="bar"></div>
      <div id="foo"></div>
      <div id="bar"></div>
    `;
    const results = findDuplicateIds();
    expect(results).toHaveLength(2);
    const ids = results.map((r: any) => r.id);
    expect(ids).toContain("foo");
    expect(ids).toContain("bar");
  });

  it("returns elements in DOM order", () => {
    document.body.innerHTML = `
      <div id="foo" data-index="1"></div>
      <div id="foo" data-index="2"></div>
      <div id="foo" data-index="3"></div>
    `;
    const results = findDuplicateIds();
    const indices = results[0].elements.map((el: any) =>
      el.getAttribute("data-index"),
    );
    expect(indices).toEqual(["1", "2", "3"]);
  });

  it("scopes the search to a given root element", () => {
    document.body.innerHTML = `
      <div id="scope">
        <span id="foo"></span>
        <span id="foo"></span>
      </div>
      <div id="foo"></div>
    `;
    const root = document.getElementById("scope")!;
    const results = findDuplicateIds(root);
    expect(results).toHaveLength(1);
    expect(results[0].elements).toHaveLength(2);
  });

  it("does not count elements outside the root", () => {
    document.body.innerHTML = `
      <div id="scope">
        <span id="foo"></span>
      </div>
      <div id="foo"></div>
    `;
    const root = document.getElementById("scope")!;
    const results = findDuplicateIds(root);
    expect(results).toHaveLength(0);
  });

  it("handles deeply nested duplicates", () => {
    document.body.innerHTML = `
      <div>
        <section>
          <article id="foo"></article>
        </section>
        <section>
          <article id="foo"></article>
        </section>
      </div>
    `;
    const results = findDuplicateIds();
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("foo");
  });

  it("returns an empty array on an empty document body", () => {
    expect(findDuplicateIds()).toEqual([]);
  });
});
