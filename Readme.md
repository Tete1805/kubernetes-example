install docker desktop (you should then have docker)  
enable kubernetes in your docker desktop (you should then have kubectl)  
make docker-desktop the default env for kubectl with: `kubectl config use-context docker-desktop`  
you can install the dashboard or use lens for instance to monitor your cluster

## install the dashboard

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/aio/deploy/recommended.yaml`

list your current service account with `kubectl get serviceaccounts`  
add a user with: `kubectl create serviceaccount dashboard-admin-user --namespace=kubernetes-dashboard`  
list your kubectl get clusterroles to find out if you have cluster-admin: `kubectl get clusterroles | grep cluster-admin`
create a cluster role binding between your dashboard-admin-user and cluster-admin: `kubectl create clusterrolebinding dashboard-admin-user --clusterrole=cluster-admin --serviceaccount=kubernetes-dashboard:dashboard-admin-usern` (be careful as this user is now the cluster's admin)

you can also follow the instructions here: https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md


`kubectl proxy`

access it at http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

get a token with `kubectl -n kubernetes-dashboard create token dashboard-admin-user`