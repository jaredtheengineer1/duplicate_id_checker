import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDuplicateIds } from "../src/react";

describe("useDuplicateIds", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("returns an empty array when there are no duplicate IDs", () => {
    document.body.innerHTML = `
      <div id="foo"></div>
      <div id="bar"></div>
    `;
    const { result } = renderHook(() => useDuplicateIds());
    expect(result.current).toEqual([]);
  });

  it("detects duplicate IDs on mount", () => {
    document.body.innerHTML = `
      <div id="foo"></div>
      <div id="foo"></div>
    `;
    const { result } = renderHook(() => useDuplicateIds());
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("foo");
    expect(result.current[0].elements).toHaveLength(2);
  });

  it("calls onDuplicate when duplicates are found", () => {
    document.body.innerHTML = `
      <div id="foo"></div>
      <div id="foo"></div>
    `;
    const onDuplicate = vi.fn();
    renderHook(() => useDuplicateIds({ onDuplicate }));
    expect(onDuplicate).toHaveBeenCalledOnce();
    expect(onDuplicate).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: "foo" })]),
    );
  });

  it("does not call onDuplicate when there are no duplicates", () => {
    document.body.innerHTML = '<div id="foo"></div>';
    const onDuplicate = vi.fn();
    renderHook(() => useDuplicateIds({ onDuplicate }));
    expect(onDuplicate).not.toHaveBeenCalled();
  });

  it("updates when a duplicate ID is added to the DOM", async () => {
    document.body.innerHTML = '<div id="foo"></div>';
    const { result } = renderHook(() => useDuplicateIds());
    expect(result.current).toHaveLength(0);

    await act(async () => {
      const el = document.createElement("div");
      el.id = "foo";
      document.body.appendChild(el);
      // allow MutationObserver to fire
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("foo");
  });

  it("updates when a duplicate ID is removed from the DOM", async () => {
    document.body.innerHTML = `
      <div id="foo" data-remove="true"></div>
      <div id="foo"></div>
    `;
    const { result } = renderHook(() => useDuplicateIds());
    expect(result.current).toHaveLength(1);

    await act(async () => {
      const el = document.querySelector('[data-remove="true"]')!;
      el.remove();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current).toHaveLength(0);
  });

  it("disconnects the observer on unmount", () => {
    const disconnect = vi.fn();

    class MockMutationObserver {
      observe = vi.fn();
      disconnect = disconnect;
      takeRecords = vi.fn();
    }

    vi.stubGlobal("MutationObserver", MockMutationObserver);

    const { unmount } = renderHook(() => useDuplicateIds());
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();

    vi.unstubAllGlobals();
  });
});
