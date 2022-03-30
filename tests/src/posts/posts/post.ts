
import { Orchestrator, Player, Cell } from "@holochain/tryorama";
import { config, installation, sleep } from '../../utils';

export default (orchestrator: Orchestrator<any>) =>  {
  
  orchestrator.registerScenario("post CRUD tests", async (s, t) => {
    // Declare two players using the previously specified config, nicknaming them "alice" and "bob"
    // note that the first argument to players is just an array conductor configs that that will
    // be used to spin up the conductor processes which are returned in a matching array.
    const [alice_player, bob_player]: Player[] = await s.players([config, config]);

    // install your happs into the conductors and destructuring the returned happ data using the same
    // array structure as you created in your installation array.
    const [[alice_happ]] = await alice_player.installAgentsHapps(installation);
    const [[bob_happ]] = await bob_player.installAgentsHapps(installation);

    await s.shareAllNodes([alice_player, bob_player]);

    const alice = alice_happ.cells.find(cell => cell.cellRole.includes('/posts.dna')) as Cell;
    const bob = bob_happ.cells.find(cell => cell.cellRole.includes('/posts.dna')) as Cell;

    const entryContents = {
  "title": "Man people but",
  "content": "Eventually, you do plan to have dinosaurs on your dinosaur tour, right? I gave it a cold? And the clock is ticking.",
  "author": "uhCAkuvyorRT9O_TVAoLwQegMYCPd5XnSteGOjRfOC3_onr0tCHzV",
  "timestamp": 1648646126025
};

    // Alice creates a post
    const create_output = await alice.call(
        "posts",
        "create_post",
        entryContents
    );
    t.ok(create_output.headerHash);
    t.ok(create_output.entryHash);

    await sleep(200);
    
    // Bob gets the created post
    const entry = await bob.call("posts", "get_post", create_output.entryHash);
    t.deepEqual(entry, entryContents);
    
    
    // Alice updates the post
    const update_output = await alice.call(
      "posts",
      "update_post",
      {
        originalHeaderHash: create_output.headerHash,
        updatedPost: {
          "title": "save can you",
  "content": "It's nice to play a character that has a soulful, dependent, close relationship. I gave it a cold? AM/FM radio, reclining bucket seats, and power windows.",
  "author": "uhCAkBsoJVW1tZrm8jhITZ_nskVnN8lcRWENoV5jHt4_hKLU-9YsY",
  "timestamp": 1648646126031
}
      }
    );
    t.ok(update_output.headerHash);
    t.ok(update_output.entryHash);
    await sleep(200);

      
    
    // Alice delete the post
    await alice.call(
      "posts",
      "delete_post",
      create_output.headerHash
    );
    await sleep(200);

    
    // Bob tries to get the deleted post, but he doesn't get it because it has been deleted
    const deletedEntry = await bob.call("posts", "get_post", create_output.entryHash);
    t.notOk(deletedEntry);
      
  });

}
