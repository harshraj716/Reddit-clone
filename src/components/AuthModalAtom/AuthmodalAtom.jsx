import { atom } from "recoil";

const defaultModalState = {
  open: false,
  view: "login",
};

export const authModalState = atom({
  key: "authModalState",
  default: defaultModalState,
});


export const defaultCommunityState = {
  mySnippets: [],
  initSnippetsFetched: false,
  currentCommunity: [],
};

export const communityState = atom({
  key: "communitiesState",
  default: defaultCommunityState,
});


const defaultPostState ={
  selectedPost: null,
  posts: [],
  postVotes: [],
  postsCache: {},
}

export const poststate= atom({
  key: 'poststate',
  default: defaultPostState,
})