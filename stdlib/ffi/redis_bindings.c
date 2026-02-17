/**
 * FreeLang Redis Bindings Implementation (Phase 17 Week 2)
 * Async Redis operations using mini-hiredis
 */

#include "redis_bindings.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

/* ===== Client Registry ===== */

#define MAX_REDIS_CLIENTS 64

typedef struct {
  void *redis_context;        /* mini_redis_t* */
  int client_id;
  int is_connected;
  char host[256];
  int port;
} fl_redis_client_t;

static fl_redis_client_t *redis_clients[MAX_REDIS_CLIENTS];
static int next_client_id = 1;
static pthread_mutex_t client_registry_mutex = PTHREAD_MUTEX_INITIALIZER;

/* ===== Helper: Context Storage ===== */

/* Store context for callback later */
typedef struct {
  int client_id;
  char *key;
  fl_event_context_t *event_ctx;
} fl_redis_callback_context_t;

/* ===== Redis Client Management ===== */

int freelang_redis_create(const char *host, int port, int callback_ctx_id) {
  if (!host || port < 1 || port > 65535) {
    return -1;
  }

  pthread_mutex_lock(&client_registry_mutex);

  /* Find free slot */
  int client_id = -1;
  for (int i = 0; i < MAX_REDIS_CLIENTS; i++) {
    if (!redis_clients[i]) {
      client_id = i;
      break;
    }
  }

  if (client_id < 0) {
    pthread_mutex_unlock(&client_registry_mutex);
    return -1;  /* Registry full */
  }

  fl_redis_client_t *client = (fl_redis_client_t*)malloc(sizeof(fl_redis_client_t));
  if (!client) {
    pthread_mutex_unlock(&client_registry_mutex);
    return -1;
  }

  strncpy(client->host, host, sizeof(client->host) - 1);
  client->host[sizeof(client->host) - 1] = '\0';
  client->port = port;
  client->client_id = client_id;
  client->is_connected = 0;
  client->redis_context = NULL;

  /* TODO: Initialize mini_redis connection */
  /* redis_clients[client_id] = mini_redis_new(uv_default_loop()); */
  /* mini_redis_connect(redis_clients[client_id], host, port, on_connect); */

  redis_clients[client_id] = client;

  printf("[Redis] Client created: %s:%d (ID: %d)\n", host, port, client_id);

  pthread_mutex_unlock(&client_registry_mutex);
  return client_id;
}

void freelang_redis_close(int client_id) {
  if (client_id < 0 || client_id >= MAX_REDIS_CLIENTS) return;

  pthread_mutex_lock(&client_registry_mutex);

  if (redis_clients[client_id]) {
    fl_redis_client_t *client = (fl_redis_client_t*)redis_clients[client_id];

    /* TODO: Close mini_redis connection */
    /* mini_redis_free(client->redis_context); */

    free(client);
    redis_clients[client_id] = NULL;

    printf("[Redis] Client closed: ID %d\n", client_id);
  }

  pthread_mutex_unlock(&client_registry_mutex);
}

/* ===== Async Commands ===== */

void freelang_redis_get(int client_id, const char *key, int callback_id) {
  if (client_id < 0 || client_id >= MAX_REDIS_CLIENTS || !key) return;

  pthread_mutex_lock(&client_registry_mutex);
  fl_redis_client_t *client = (fl_redis_client_t*)redis_clients[client_id];
  pthread_mutex_unlock(&client_registry_mutex);

  if (!client || !client->is_connected) return;

  /* TODO: Send GET command to Redis */
  /* mini_redis_get(client->redis_context, key, on_get_reply, (void*)(intptr_t)callback_id); */

  fprintf(stderr, "[Redis] GET %s (client %d, callback %d) - stub\n", key, client_id, callback_id);
}

void freelang_redis_set(int client_id, const char *key, const char *value, int callback_id) {
  if (client_id < 0 || client_id >= MAX_REDIS_CLIENTS || !key || !value) return;

  pthread_mutex_lock(&client_registry_mutex);
  fl_redis_client_t *client = (fl_redis_client_t*)redis_clients[client_id];
  pthread_mutex_unlock(&client_registry_mutex);

  if (!client || !client->is_connected) return;

  /* TODO: Send SET command to Redis */
  /* mini_redis_set(client->redis_context, key, value, on_set_reply, (void*)(intptr_t)callback_id); */

  fprintf(stderr, "[Redis] SET %s %s (client %d, callback %d) - stub\n", key, value, client_id, callback_id);
}

void freelang_redis_del(int client_id, const char *key, int callback_id) {
  if (client_id < 0 || client_id >= MAX_REDIS_CLIENTS || !key) return;

  pthread_mutex_lock(&client_registry_mutex);
  fl_redis_client_t *client = (fl_redis_client_t*)redis_clients[client_id];
  pthread_mutex_unlock(&client_registry_mutex);

  if (!client || !client->is_connected) return;

  fprintf(stderr, "[Redis] DEL %s (client %d, callback %d) - stub\n", key, client_id, callback_id);
}

void freelang_redis_exists(int client_id, const char *key, int callback_id) {
  if (client_id < 0 || client_id >= MAX_REDIS_CLIENTS || !key) return;

  fprintf(stderr, "[Redis] EXISTS %s (client %d, callback %d) - stub\n", key, client_id, callback_id);
}

void freelang_redis_incr(int client_id, const char *key, int callback_id) {
  if (client_id < 0 || client_id >= MAX_REDIS_CLIENTS || !key) return;

  fprintf(stderr, "[Redis] INCR %s (client %d, callback %d) - stub\n", key, client_id, callback_id);
}

void freelang_redis_expire(int client_id, const char *key, int seconds, int callback_id) {
  if (client_id < 0 || client_id >= MAX_REDIS_CLIENTS || !key || seconds <= 0) return;

  fprintf(stderr, "[Redis] EXPIRE %s %d (client %d, callback %d) - stub\n", key, seconds, client_id, callback_id);
}

/* ===== Connection Status ===== */

int freelang_redis_is_connected(int client_id) {
  if (client_id < 0 || client_id >= MAX_REDIS_CLIENTS) return 0;

  pthread_mutex_lock(&client_registry_mutex);
  fl_redis_client_t *client = (fl_redis_client_t*)redis_clients[client_id];
  int connected = client ? client->is_connected : 0;
  pthread_mutex_unlock(&client_registry_mutex);

  return connected;
}

int freelang_redis_ping(int client_id, int callback_id) {
  if (client_id < 0 || client_id >= MAX_REDIS_CLIENTS) return -1;

  fprintf(stderr, "[Redis] PING (client %d, callback %d) - stub\n", client_id, callback_id);
  return 0;
}
