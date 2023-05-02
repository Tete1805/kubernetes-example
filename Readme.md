# Simple Kubernetes example

## Prepare the cluster
On Windows:
Install docker desktop (you should then have docker)  
Enable kubernetes in your docker desktop (you should then have kubectl)  
Make docker-desktop the default env for kubectl with
```
kubectl config use-context docker-desktop
```

You can install the dashboard or use Lens for instance to monitor your cluster (or another UI)

You can also install Minikube or Kind to create a simple cluster for you


## Install the dashboard

The dashboard is a complex deployment relying on many different parts (ServiceAccount, Secret, Namespace...).  
If you're interested, you can read the content of the deployment here: https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml but it might be a bit soon and is not required at this stage.

To install the dashboard, type in a shell
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

Now that the dashboard is installed, you need to create a service account to get a token to access it. (O_O)
You can do these with yaml files as explained here: https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md

_However, let me show you how to use the kubernetes CLI (kubectl aka kube control in canon) to do so._

List your current service accounts with `kubectl get serviceaccounts`  
This should print something like
```
NAME                   SECRETS   AGE
default                0         1d2h
```

If you haven't already, add a new service account named `dashboard-admin-user` with:
```
kubectl create serviceaccount dashboard-admin-user --namespace=kubernetes-dashboard
```
NB: Note that I'm specifiying a namespace here, this is the namespace set in the deployment. (Go check now.)


List your cluster roles to verify that you have the `cluster-admin` one:
```
kubectl get clusterroles | grep cluster-admin
```
This should print out a line like: 
```
cluster-admin         yyyy-mm-ddThh:mm:ssZ
```
Create a cluster role binding between your dashboard-admin-user and cluster-admin: 
```
kubectl create clusterrolebinding dashboard-admin-user --clusterrole=cluster-admin --serviceaccount=kubernetes-dashboard:dashboard-admin-user
```
(be careful as this user is now the cluster's admin since we just bound it to the role cluster-admin)

In production, you should probably only have a read only service account for the dashboard, or create a specific user with required access (see rbac in documentation)

Proxyify the dashboard with `kubectl proxy`
You can now access it at http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

Get a token for the user we just created with `kubectl -n kubernetes-dashboard create token dashboard-admin-user`

## Secrets
To store username / password for db
```
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  USER_NAME: YWRtaW4=
  PASSWORD: MWYyZDFlMmU2N2Rm
```
usage in a deployment:
```
    env:
      - name: SECRET_USERNAME
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: USER_NAME
```
## ConfigMap
To store db url for instance
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: mongo-config
data:
  mongodbrl: 'blabla'
```
usage in a deploy
```
    env:
      - name: SECRET_USERNAME
        valueFrom:
          configMaptKeyRef:
            name: mongo-config
            key: mongodburl
 
```
## Ingress
For external network access and routing?

## Cassandra/Mongo
Showcase install with and without statefulsets plus UI like mongo-express

## Kafka/Rabbit
Showcase installation and simple use case
