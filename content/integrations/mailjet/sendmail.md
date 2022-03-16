+++
title = "Send Mail"
description = "Send mails via MailJet"
kind = "Reactor"
pricing = "FREE"
+++

# Introduction

This integration allows you to send templated mails via
[Mailjet](https://mailjet.com).

# Usage

Templating is done with [gotempl](https://github.com/link-society/gotempl).
Therefore, you can use the environment variables provided to the Kubirds Reactor
in your templates:

**html-part.template:**

```html
<p>Unit name: <pre>{{ .Env.UNIT_NAME }} / {{ .Env.UNIT_NAMESPACE }}</pre></p>
<p>Unit state: <pre>{{ .Env.UNIT_STATE }}</pre></p>
<p>Unit logs:</p>
<pre>{{ readFile .Env.UNIT_OUTPUT }}</pre>
```

The mail is sent with the [mailjetctl](https://github.com/link-society/mailjetctl)
utility.

## Environment

| Variable | Default | Description |
| --- | --- | --- |
| `MJ_APIKEY_PUBLIC` | N/A | Your MailJet public API key. **REQUIRED** |
| `MJ_APIKEY_PRIVATE` | N/A | Your MailJet private API key. **REQUIRED** |
| `SENDER_ADDRESS` | N/A | Email address to use as `From`. **REQUIRED** |
| `RECIPIENT_LIST_TEMPLATE` | N/A | Path to template file to generate the recipient list (one email address per line). **REQUIRED** |
| `SUBJECT_TEMPLATE` | N/A | Path to template file to generate the mail's subject. **REQUIRED** |
| `TEXT_PART_TEMPLATE` | N/A | Path to template file to generate the mail's body as `text/plain`. |
| `HTML_PART_TEMPLATE` | N/A | Path to template file to generate the mail's body as `text/html`. |

**NB:**

 - At least one of `TEXT_PART_TEMPLATE` or `HTML_PART_TEMPLATE` must be provided
 - Email addresses can include a name in the following format: `Name <name@example.com>`

## Example of Reactor

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-templates
data:
  recipients.template: |
    foo@example.com
    Bar <bar@example.com>
  subject.template: "[UNIT] {{ .Env.UNIT_NAME }} - {{ .Env.UNIT_NAMESPACE }}: {{ .Env.UNIT_STATE }}"
  html-part.template: |
    <p><b>Labels:</b></p>

    <table>
      {{ range $key, $value := (.Env.UNIT_LABELS_JSON | fromJson) }}
        <tr>
          <td>{{ $key }}</td>
          <td><pre>{{ $value }}</pre></td>
        </tr>
      {{ end }}
    </table>

    <p><b>Logs:</b></p>

    <pre>{{ readFile .Env.UNIT_OUTPUT }}</pre>

---
apiVersion: kubirds.com/v1
kind: Reactor
metadata:
  name: notify-by-mail
spec:
  unitSelector: {}
  emptySelectorBehavior: MatchAll
  triggers:
    success: no
    failure: no
    fixed: yes
    regression: yes
  image:
    name: linksociety/kubirds-reactor-mailjet:latest
    pullPolicy: Always
    command: sendmail
  volumes:
    - name: templates
      mountPath: /templates
      configMap:
        name: my-templates
  envFrom:
    - secretRef:
      name: mailjet-credentials  # provides MJ_APIKEY_PUBLIC and MJ_APIKEY_PRIVATE
  env:
    - name: SENDER_ADDRESS
      value: "Notification <noreply@example.com>"
    - name: RECIPIENT_LIST_TEMPLATE
      value: /templates/recipients.template
    - name: SUBJECT_TEMPLATE
      value: /templates/subject.template
    - name: HTML_PART_TEMPLATE
      value: /templates/html-part.template
```
