import { Orchestrator } from "@holochain/tryorama";

import posts_post from './posts/posts/post';
import comments_entry_def_0 from './posts/comments/entry_def_0';
import reactions_entry_def_0 from './posts/reactions/entry_def_0';
import profiles_entry_def_0 from './posts/profiles/entry_def_0';

let orchestrator: Orchestrator<any>;

orchestrator = new Orchestrator();
posts_post(orchestrator);
orchestrator.run();

orchestrator = new Orchestrator();
comments_entry_def_0(orchestrator);
orchestrator.run();

orchestrator = new Orchestrator();
reactions_entry_def_0(orchestrator);
orchestrator.run();

orchestrator = new Orchestrator();
profiles_entry_def_0(orchestrator);
orchestrator.run();



