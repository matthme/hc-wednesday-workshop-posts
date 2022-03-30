
import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@holochain-open-dev/context';
import { appInfoContext, appWebsocketContext } from '../../../contexts';
import { Post } from '../../../types/posts/posts';
import '@material/mwc-circular-progress';
import '@type-craft/title/title-detail';
import '@type-craft/content/content-detail';
import '@holochain-open-dev/utils/copiable-hash';
import '@type-craft/date-time/date-time-detail';
import "@holochain-open-dev/profiles/agent-avatar";
import "@holochain-open-dev/comments/comment-thread";
import "@holochain-open-dev/reactions/reactions-row";
import "@holochain-open-dev/reactions/choosable-emoji-reaction";

@customElement('post-detail')
export class PostDetail extends LitElement {
  @property()
  entryHash!: string;

  @state()
  _post: Post | undefined;

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async firstUpdated() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'posts')!;

    this._post = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'posts',
      fn_name: 'get_post',
      payload: this.entryHash,
      provenance: cellData.cell_id[1]
    });
  }

  render() {
    if (!this._post) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }

    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Post</span>


    <title-detail

    .value=${this._post.title}
      style="margin-top: 16px"
    ></title-detail>


    <content-detail

    .value=${this._post.content}
      style="margin-top: 16px"
    ></content-detail>


    <agent-avatar

    .agentPubKey=${this._post.author}
      style="margin-top: 16px"
    ></agent-avatar>


    <date-time-detail

    .value=${this._post.timestamp}
      style="margin-top: 16px"
    ></date-time-detail>

    <comment-thread .entryHash=${this.entryHash}>
    </comment-thread>

    <div class="reactions-row">
        <reactions-row .entryHash=${this.entryHash}></reactions-row>
        <choosable-emoji-reaction .entryHash=${this.entryHash}></choosable-emoji-reaction>
  </div>

      </div>
    `;
  }
}
