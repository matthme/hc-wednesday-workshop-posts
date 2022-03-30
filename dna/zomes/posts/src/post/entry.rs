use hdk::prelude::holo_hash::AgentPubKeyB64;
use hdk::prelude::*;









#[hdk_entry(id = "post")]
#[serde(rename_all = "camelCase")]
#[derive(Clone)]
pub struct Post {
  pub title: String,
  pub content: String,
  pub author: AgentPubKeyB64,
  pub timestamp: Timestamp,
}