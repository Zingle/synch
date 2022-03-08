import expect from "expect.js";
import synch from "@zingle/synch";

describe("synch()", () => {
  it("should return a synchronization primitive", async () => {
    const sync = synch();
    let waited = false;

    expect(sync).to.be.a("function");
    expect(sync.then).to.be.a("function");

    wait();
    expect(waited).to.be(false);

    await new Promise(go => setTimeout(go, 0));
    expect(waited).to.be(false);

    sync();
    expect(waited).to.be(false);

    await new Promise(go => setTimeout(go, 0));
    expect(waited).to.be(true);

    async function wait() {
      await sync;
      waited = true;
    }
  });
});

describe("synch.reset()", () => {
  it("should reset synchronization primitive", async () => {
    const sync = synch();
    let waited = false;

    // initial synchronize
    wait();
    sync();
    await new Promise(go => setTimeout(go, 0));
    expect(waited).to.be(true);

    // remains in synchronized state without calling sync()
    waited = false;
    wait();
    await new Promise(go => setTimeout(go, 0));
    expect(waited).to.be(true);

    // after reset, synchronize must be triggered again by calling sync()
    sync.reset();
    waited = false;
    wait();
    await new Promise(go => setTimeout(go, 0));
    expect(waited).to.be(false);

    // calling sync() will now trigger the synchronization again
    sync();
    await new Promise(go => setTimeout(go, 0));
    expect(waited).to.be(true);

    async function wait() {
      await sync;
      waited = true;
    }
  });
});
