import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import { getIssuesSuccess, getIssuesFailure, createIssueSuccess, createIssueFailure } from './reducer'; 

import { GetIssues, GetIssuesRequest, CreateIssue, CreateIssueRequest } from './types'; 

import * as API from './api/v0';

/** maybe just reload the issues content when there is a new issue created?*/

export function* getIssuesWorker(action: GetIssuesRequest): SagaIterator {
    const { key } = action.payload; 
    let response;
    try {
        response = yield call(API.getIssues, key); 
        yield put(getIssuesSuccess(response.issues, response.remaining, response.remaining_url)); 
    } catch(e) {
        yield put(getIssuesFailure([], 0, null)); 
    }
}

export function* getIssuesWatcher(): SagaIterator {
    yield takeEvery(GetIssues.REQUEST, getIssuesWorker); 
}

export function* createIssueWorker(action: CreateIssueRequest): SagaIterator {
  try { 
    let response;
    response = yield call(API.createIssue, action.payload.data);
    yield put((createIssueSuccess(response)));
  } catch(error) {
    yield put(createIssueFailure(null));
  }
}

export function* createIssueWatcher(): SagaIterator {
    yield takeEvery(CreateIssue.REQUEST, createIssueWorker)
}
