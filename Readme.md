# Simple Kubernetes example

## Prepare the cluster

On Windows:
Install docker desktop (you should then have docker)  
Enable kubernetes in your docker desktop (you should then have kubectl)  
Make docker-desktop the default env for kubectl with

```sh
kubectl config use-context docker-desktop
```

You can install the dashboard or use Lens for instance to monitor your cluster (or another UI)

You can also install Minikube or Kind to create a simple cluster for you. (Preferred method forfirst time users.)

## Install the dashboard

The dashboard is a complex deployment relying on many different parts (ServiceAccount, Secret, Namespace...).  
If you're interested, you can read the content of the deployment here: https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml but it might be a bit soon and is not required at this stage.

To manually install the dashboard, type in a shell

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

Now that the dashboard is installed, you need to create a service account to get a token to access it. (O_O)
You can do these with yaml files as explained here: https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md

_However, let me show you how to use the kubernetes CLI (kubectl aka kube control in canon) to do so._

List your current service accounts with `kubectl get serviceaccounts`  
This should print something like

```sh
NAME                   SECRETS   AGE
default                0         1d2h
```

If you haven't already, add a new service account named `dashboard-admin-user` with:

```sh
kubectl create serviceaccount dashboard-admin-user --namespace=kubernetes-dashboard
```

NB: Note that I'm specifiying a namespace here, this is the namespace set in the deployment. (Go check now.)

List your cluster roles to verify that you have the `cluster-admin` one:

```sh
kubectl get clusterroles | grep cluster-admin
```

This should print out a line like:

```sh
cluster-admin         yyyy-mm-ddThh:mm:ssZ
```

Create a cluster role binding between your dashboard-admin-user and cluster-admin:

```sh
kubectl create clusterrolebinding dashboard-admin-user --clusterrole=cluster-admin --serviceaccount=kubernetes-dashboard:dashboard-admin-user
```

(be careful as this user is now the cluster's admin since we just bound it to the role cluster-admin)

In production, you should probably only have a read only service account for the dashboard, or create a specific user with required access (see rbac in documentation)

Proxyify the dashboard with `kubectl proxy`
You can now access it at http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

Get a token for the user we just created with `kubectl -n kubernetes-dashboard create token dashboard-admin-user`

_NB:_ The dashboard user needs to be able to access the different endpoints used in the dashboard. (Not covered here.)

Note that with Minikube, you can simply type in a terminal:

```sh
minikube dashboard
```

## Secrets

To store sensitive informations, like credentials.

_NB:_ Secrets are not secured by default, for more information, see:

- https://kubernetes.io/docs/concepts/configuration/secret/
- https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/
- https://kubernetes.io/docs/concepts/security/secrets-good-practices/

Example, to store username / password for db

```yml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  USER_NAME: YWRtaW4= # "admin" in base64
  PASSWORD: c2VjcmV0 # "secret" in base64
```

usage in a deployment:

```yml
env:
  - name: SECRET_USERNAME
    valueFrom:
      secretKeyRef:
        name: mysecret
        key: USER_NAME
```

You can also use files instead of base64 values.

```sh
kubectl create secret generic ssh-key-secret --from-file=ssh-privatekey=/path/to/.ssh/id_rsa --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

## ConfigMap

To store db url for instance

```yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mongo-config
data:
  mongodbrl: 'blabla'
```

usage in a deploy

```yml
env:
  - name: SECRET_USERNAME
    valueFrom:
      configMaptKeyRef:
        name: mongo-config
        key: mongodburl
```

## Ingress

For external network access and routing, see ingress.yml for an example.
https://kubernetes.io/docs/concepts/services-networking/ingress/

## Example app

See `back` and `front` folders for example apps.
Deploy with `app.yml`.
Use this command to forward ports:

```sh
kubectl port-forward
```

Or use the provided ingress and then

```sh
minikube ip
```

Then, add the following entry to your /etc/hosts file:

```txt
<minikube-ip-address> my-nodejs-api.local
```

## Cassandra/Mongo

Showcase install with and without statefulsets plus UI like mongo-express
https://kubernetes.io/fr/docs/concepts/workloads/controllers/statefulset/

## Kafka/Rabbit

Showcase installation and simple use case

## Helm

Showcase installation with Helm instead
https://helm.sh/fr/docs/intro/using_helm/

## Operators

Showcase operators
https://kubernetes.io/docs/concepts/extend-kubernetes/operator/

## NB

All of these would be different on a production server of course.
It's just an example.
