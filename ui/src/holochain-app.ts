import '@webcomponents/scoped-custom-element-registry';

import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AppWebsocket, InstalledCell } from '@holochain/client';
import { ContextProvider } from '@holochain-open-dev/context';
import '@material/mwc-circular-progress';

import './components/posts/posts/create-post';
import './components/posts/posts/post-detail';
import { appWebsocketContext, appInfoContext } from './contexts';

import "@holochain-open-dev/profiles/profile-prompt";

import {
  ProfilesStore,
  profilesStoreContext,
} from "@holochain-open-dev/profiles";
import { ReactionsStore, reactionsStoreContext } from "@holochain-open-dev/reactions";
import { CommentsStore, commentsStoreContext } from '@holochain-open-dev/comments';


import { HolochainClient } from "@holochain-open-dev/cell-client";


@customElement('holochain-app')
export class HolochainApp extends LitElement {
  @state() loading = true;
  @state() entryHash: string | undefined;

  async firstUpdated() {
    const appWebsocket = await AppWebsocket.connect(
      `ws://localhost:${process.env.HC_PORT}`
    );

    new ContextProvider(this, appWebsocketContext, appWebsocket);

    const appInfo = await appWebsocket.appInfo({
      installed_app_id: 'posts'
    });
    new ContextProvider(this, appInfoContext, appInfo);


    const client = await HolochainClient.connect(
      // TODO: change this to the port where holochain is listening,
      // or `ws://localhost:${process.env.HC_PORT}` if you used the scaffolding tooling to bootstrap the application
      `ws://localhost:${process.env.HC_PORT}`,
      // TODO: change "my-app-id" for the installed_app_id of your application
      "posts"
    );
    // TODO: change "my-cell-role" for the roleId that you can find in your "happ.yaml"
    const cellClient = client.forCell(client.cellDataByRoleId("posts")!);

    const store = new ProfilesStore(cellClient, {
      avatarMode: "avatar",
    });

    new ContextProvider(this, profilesStoreContext, store);
    new ContextProvider(this, reactionsStoreContext, new ReactionsStore(cellClient));
    new ContextProvider(this, commentsStoreContext, new CommentsStore(cellClient));

    this.loading = false;
  }


  render() {
    if (this.loading)
      return html`
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      `;

    return html`
      <profile-prompt>
        <h1>posts</h1>

        <create-post @post-created=${(e: CustomEvent) => this.entryHash = e.detail.entryHash}></create-post>
    ${this.entryHash ? html`
      <post-detail .entryHash=${this.entryHash}></post-detail>
    ` : html``}
      </profile-prompt>
    `;
  }

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--lit-element-background-color);
    }

    main {
      flex-grow: 1;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;
}
