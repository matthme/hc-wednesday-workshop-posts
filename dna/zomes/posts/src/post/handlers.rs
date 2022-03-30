use hdk::prelude::*;
use hdk::prelude::holo_hash::*;
use super::Post;

#[hdk_extern]
pub fn get_post(entry_hash: EntryHashB64) -> ExternResult<Option<Post>> {
  let maybe_element = get(EntryHash::from(entry_hash), GetOptions::default())?;

  match maybe_element {
    None => Ok(None),
    Some(element) => {
      let post: Post = element.entry()
        .to_app_option()?
        .ok_or(WasmError::Guest("Could not deserialize element to Post.".into()))?;

      Ok(Some(post))
    }
  }
}


#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all="camelCase")]
pub struct NewPostInput {
  title: String,
  content: String,
}


#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NewPostOutput {
  header_hash: HeaderHashB64,
  entry_hash: EntryHashB64,
}

#[hdk_extern]
pub fn create_post(input: NewPostInput) -> ExternResult<NewPostOutput> {

  let agent_pub_key = agent_info()?.agent_initial_pubkey;
  let time = sys_time()?;

  let post = Post {
    title: input.title,
    content: input.content,
    author: agent_pub_key.into(),
    timestamp: time,
  };

  let header_hash = create_entry(&post)?;

  let entry_hash = hash_entry(&post)?;

  let output = NewPostOutput {
    header_hash: HeaderHashB64::from(header_hash),
    entry_hash: EntryHashB64::from(entry_hash)
  };

  Ok(output)
}


#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct UpdatePostInput {
  original_header_hash: HeaderHashB64,
  updated_post: Post
}

#[hdk_extern]
pub fn update_post(input: UpdatePostInput) -> ExternResult<NewPostOutput> {
  let header_hash = update_entry(HeaderHash::from(input.original_header_hash), &input.updated_post)?;

  let entry_hash = hash_entry(&input.updated_post)?;

  let output = NewPostOutput {
    header_hash: HeaderHashB64::from(header_hash),
    entry_hash: EntryHashB64::from(entry_hash)
  };

  Ok(output)
}


#[hdk_extern]
pub fn delete_post(header_hash: HeaderHashB64) -> ExternResult<HeaderHash> {
  delete_entry(HeaderHash::from(header_hash))
}

