``` yaml
# サーバーのメンテナ情報
maintainer:
  # メンテナの名前
  name:

  # メンテナの連絡先(URLかmailto形式のURL)
  url:

# (Misskeyを動かす)URL
url:

# 待受ポート
port:

# TLSの設定(利用しない場合は省略可能)
https:
  # 証明書のパス...
  key:
  cert:

# MongoDBの設定
mongodb:
  host: localhost
  port: 27017
  db: misskey
  user:
  pass:

# Redisの設定
redis:
  host: localhost
  port: 6379
  pass:

# reCAPTCHAの設定
recaptcha:
  site_key:
  secret_key:

# ServiceWrokerの設定
sw:
  # VAPIDの公開鍵
  public_key:

  # VAPIDの秘密鍵
  private_key:

# Google Maps API
google_maps_api_key:

# Twitterインテグレーションの設定(利用しない場合は省略可能)
twitter:
  # インテグレーション用アプリのコンシューマーキー
  consumer_key:

  # インテグレーション用アプリのコンシューマーシークレット
  consumer_secret:

```
