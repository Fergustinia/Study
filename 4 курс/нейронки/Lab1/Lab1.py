#!/usr/bin/env python
# coding: utf-8

# ## Лабораторная работа № 1
# ### Андрюшина Мария, 932001
# ### Задание №1
# ### Бинарный классификатор

# In[60]:


import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import recall_score, precision_score, balanced_accuracy_score, roc_auc_score, roc_curve
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.metrics import RocCurveDisplay
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras import layers
from keras.layers import Dense
from keras.callbacks import ModelCheckpoint, EarlyStopping
from tensorflow.keras.utils import to_categorical


# ### Работа с данными

# In[4]:


df = pd.read_csv('diabetes_012_health_indicators_BRFSS2015.csv')
df.head()


# In[5]:


df.shape


# In[6]:


#Пропусков нет
df.isnull().sum()/df.shape[0]


# In[7]:


df.info()


# In[8]:


df['Diabetes_012'] = df['Diabetes_012'].replace({2 : 1})  


# In[9]:


df1 = df.drop_duplicates()


# In[10]:


df1.shape


# ### Создание моделей
# #### Base Model

# Разделим датасет на три части: тренировочную (70%), тестовую (20%) и валидационную (10%).

# In[12]:


X_train, X_rem, y_train, y_rem = train_test_split(df1.drop(['Diabetes_012'], axis=1), df1['Diabetes_012'],
                                                   train_size=0.7, random_state=77)

X_valid, X_test, y_valid, y_test = train_test_split(X_rem, y_rem, test_size=0.66, random_state=77)


# Создадим базовую модель нейронной сети, состоящую из 2 слоёв:
# 1. 4 нейрона, функция активации - ReLU
# 2. 1 нейрон, функция активации - Sigmoid

# In[13]:


binary_classifier = Sequential(
    [
        layers.Dense(4, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dense(1, activation = 'sigmoid')
    ]
)
binary_classifier.summary()


# In[14]:


binary_classifier.compile(loss = 'binary_crossentropy', optimizer = 'adam', metrics = 'accuracy')


# In[15]:


early_stop = EarlyStopping(monitor = 'val_accuracy', patience = 10, mode = 'max', verbose = 1)
checkpoint = ModelCheckpoint('cancer_weights-{epoch:02d}-{val_accuracy:.3f}.hdf5',
                             monitor = 'val_accuracy', verbose = 1, mode = 'max',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# Зададим количество объектов в одном батче, равное 10, и число эпох, равное 100:

# In[16]:


binary_class_history = binary_classifier.fit(X_train, y_train, batch_size = 10, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 100)


# In[17]:


plt.figure(figsize=(20,8))
loss_function = binary_class_history.history['loss']
val_loss_function = binary_class_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

acc = binary_class_history.history['accuracy']
val_acc = binary_class_history.history['val_accuracy']
epochs = range(1,len(acc)+1)

plt.subplot(1, 2, 1)
plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()

plt.subplot(1, 2, 2)
plt.title('Accuracy (Train & Val Sets)')
plt.plot(epochs,acc,label='Accuracy (Train)')
plt.plot(epochs,val_acc,color='orange',label='Accuracy (Validation)')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()


# In[18]:


probs = binary_classifier.predict(X_test)[:,0]
truth = y_test


# In[19]:


preds = (probs>0.5).astype(int)
preds


# In[20]:


df_metrics = pd.DataFrame(columns=['model', 'recall', 'precision', 'weighted_accuracy', 'auc'])
recall = round(recall_score(truth, preds), 4)
precision = round(precision_score(truth, preds), 4)
weighted_accuracy = round(balanced_accuracy_score(truth, preds), 4)
auc = round(roc_auc_score(truth, probs), 4)
df_metrics.loc[len(df_metrics.index)] = ['base_model', recall, precision, weighted_accuracy, auc] 


# In[21]:


df_metrics


# #### Second Model

# Во второй модели увеличим количество слоёв, не увиличивая число нейронов и чередуя функции активации:
# 1. 4 нейрона, функция активации - ReLU
# 2. 4 нейрона, функция активации - Sigmoid
# 3. 4 нейрона, функция активации - ReLU
# 4. 4 нейрона, функция активации - Sigmoid
# 5. 2 нейрона, функция активации - ReLU
# 6. 1 нейрон, функция активации - Sigmoid

# In[26]:


binary_classifier_2 = Sequential(
    [
        layers.Dense(4, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dense(4, activation = 'sigmoid'),
        layers.Dense(4, activation = 'relu'),
        layers.Dense(4, activation = 'sigmoid'),
        layers.Dense(2, activation = 'relu'),
        layers.Dense(1, activation = 'sigmoid')
    ]
)
binary_classifier_2.summary()


# In[27]:


binary_classifier_2.compile(loss = 'binary_crossentropy', optimizer = 'adam', metrics = 'accuracy')


# In[28]:


early_stop = EarlyStopping(monitor = 'val_accuracy', patience = 10, mode = 'max', verbose =1)
checkpoint = ModelCheckpoint('cancer2_weights-{epoch:02d}-{val_accuracy:.3f}.hdf5',
                             monitor = 'val_accuracy', verbose = 1, mode = 'max',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# In[29]:


binary_class_history = binary_classifier_2.fit(X_train, y_train, batch_size = 10, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 100)


# In[30]:


plt.figure(figsize=(20,8))
loss_function = binary_class_history.history['loss']
val_loss_function = binary_class_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

acc = binary_class_history.history['accuracy']
val_acc = binary_class_history.history['val_accuracy']
epochs = range(1,len(acc)+1)

plt.subplot(1, 2, 1)
plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()

plt.subplot(1, 2, 2)
plt.title('Accuracy (Train & Val Sets)')
plt.plot(epochs,acc,label='Accuracy (Train)')
plt.plot(epochs,val_acc,color='orange',label='Accuracy (Validation)')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()


# In[31]:


probs = binary_classifier_2.predict(X_test)[:,0]
truth = y_test


# In[32]:


preds = (probs>0.5).astype(int)
preds


# In[33]:


recall = round(recall_score(truth, preds), 4)
precision = round(precision_score(truth, preds), 4)
weighted_accuracy = round(balanced_accuracy_score(truth, preds), 4)
auc = round(roc_auc_score(truth, probs), 4)
df_metrics.loc[len(df_metrics.index)] = ['seсond_model', recall, precision, weighted_accuracy, auc] 


# In[34]:


df_metrics


# #### Third Model

# Увеличим количество нейронов на каждом слое, кроме последнего:
# 1. 64 нейрона, функция активации - ReLU
# 2. 64 нейрона, функция активации - Sigmoid
# 3. 32 нейрона, функция активации - ReLU
# 4. 16 нейронов, функция активации - Sigmoid
# 5. 8 нейронов, функция активации - ReLU
# 6. 1 нейрон, функция активации - Sigmoid

# In[35]:


binary_classifier_3 = Sequential(
    [
        layers.Dense(64, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dense(64, activation = 'sigmoid'),
        layers.Dense(32, activation = 'relu'),
        layers.Dense(16, activation = 'sigmoid'),
        layers.Dense(8, activation = 'relu'),
        layers.Dense(1, activation = 'sigmoid')
    ]
)
binary_classifier_3.summary()


# In[36]:


binary_classifier_3.compile(loss = 'binary_crossentropy', optimizer = 'adam', metrics = 'accuracy')


# In[37]:


early_stop = EarlyStopping(monitor = 'val_accuracy', patience = 10, mode = 'max', verbose =1)
checkpoint = ModelCheckpoint('cancer3_weights-{epoch:02d}-{val_accuracy:.3f}.hdf5',
                             monitor = 'val_accuracy', verbose = 1, mode = 'max',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# Увеличим число объектов в одном батче в 10 раз и уменьшим количество эпох в 2 раза:

# In[38]:


binary_class_history = binary_classifier_3.fit(X_train, y_train, batch_size = 100, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 50)


# In[39]:


plt.figure(figsize=(20,8))
loss_function = binary_class_history.history['loss']
val_loss_function = binary_class_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

acc = binary_class_history.history['accuracy']
val_acc = binary_class_history.history['val_accuracy']
epochs = range(1,len(acc)+1)

plt.subplot(1, 2, 1)
plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()

plt.subplot(1, 2, 2)
plt.title('Accuracy (Train & Val Sets)')
plt.plot(epochs,acc,label='Accuracy (Train)')
plt.plot(epochs,val_acc,color='orange',label='Accuracy (Validation)')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()


# In[40]:


probs = binary_classifier_3.predict(X_test)[:,0]
truth = y_test


# In[41]:


preds = (probs>0.5).astype(int)
preds


# In[42]:


recall = round(recall_score(truth, preds), 4)
precision = round(precision_score(truth, preds), 4)
weighted_accuracy = round(balanced_accuracy_score(truth, preds), 4)
auc = round(roc_auc_score(truth, probs), 4)
df_metrics.loc[len(df_metrics.index)] = ['third_model', recall, precision, weighted_accuracy, auc] 


# In[43]:


df_metrics


# #### Fourth Model

# Добавим Dropout(0.1) после нескольких первых слоёв:

# In[49]:


binary_classifier_4 = Sequential(
    [
        layers.Dense(64, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dropout(0.1),
        layers.Dense(64, activation = 'sigmoid'),
        layers.Dropout(0.1),
        layers.Dense(32, activation = 'relu'),
        layers.Dropout(0.1),
        layers.Dense(16, activation = 'sigmoid'),
        layers.Dense(8, activation = 'relu'),
        layers.Dense(1, activation = 'sigmoid')
    ]
)
binary_classifier_4.summary()


# Изменим процедуру оптимизации на SGD:

# In[50]:


binary_classifier_4.compile(loss = 'binary_crossentropy', optimizer = 'sgd', metrics = 'accuracy')


# In[51]:


early_stop = EarlyStopping(monitor = 'val_accuracy', patience = 10, mode = 'max', verbose =1)
checkpoint = ModelCheckpoint('cancer4_weights-{epoch:02d}-{val_accuracy:.3f}.hdf5',
                             monitor = 'val_accuracy', verbose = 1, mode = 'max',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# In[52]:


binary_class_history = binary_classifier_4.fit(X_train, y_train, batch_size = 100, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 50)


# In[53]:


plt.figure(figsize=(20,8))
loss_function = binary_class_history.history['loss']
val_loss_function = binary_class_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

acc = binary_class_history.history['accuracy']
val_acc = binary_class_history.history['val_accuracy']
epochs = range(1,len(acc)+1)

plt.subplot(1, 2, 1)
plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()

plt.subplot(1, 2, 2)
plt.title('Accuracy (Train & Val Sets)')
plt.plot(epochs,acc,label='Accuracy (Train)')
plt.plot(epochs,val_acc,color='orange',label='Accuracy (Validation)')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()


# In[54]:


probs = binary_classifier_4.predict(X_test)[:,0]
truth = y_test


# In[55]:


preds = (probs>0.5).astype(int)
preds


# In[56]:


recall = round(recall_score(truth, preds), 4)
precision = round(precision_score(truth, preds), 4)
weighted_accuracy = round(balanced_accuracy_score(truth, preds), 4)
auc = round(roc_auc_score(truth, probs), 4)
df_metrics.loc[len(df_metrics.index)] = ['fourth_model', recall, precision, weighted_accuracy, auc] 


# In[57]:


df_metrics


# Анализируя полученные метрики 4-х моделей, можно сделать вывод, что наилучшим бинарным классификатором является Second Model.
# 
# Построим ROC-кривую для данной модели:

# In[61]:


probs_2 = binary_classifier_2.predict(X_test)[:,0]
truth = y_test


# In[62]:


preds_2 = (probs_2>0.5).astype(int)
preds_2


# In[64]:


fpr, tpr, thresholds = roc_curve(truth, probs_2, pos_label=1)
lw = 2
plt.rcParams['figure.figsize']=(5,5)
plt.plot(fpr, tpr, lw=lw, label='ROC curve ')
plt.plot([0, 1], [0, 1])
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.0])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC curve')

plt.show()


# ### Вывод

# Набор данных 'diabetes_012_health_indicators_BRFSS2015.csv' не содержал пропущенных значений, но в нем присутствовало несколько дубликатов, которые были удалены. Значения 2 в таргетном столбце были преобразованы в 1, так как этого требовало условие задания.
# 
# Среди четырёх моделей бинарных классификаторов лучше всего сработала Second Model. В ней увеличено число слоёв по сравнению с Base Model, но не увеличено число нейронов на каждом слое.
# 
# Оценка качества бинарных классификаторов происходила по следующим метрикам: Recall, Precision, Weighted Accuracy и AUC. Эти показатели у Second Model в среднем выше, чем у остальных моделей.

# ### Задание №2
# ### Многоклассовый классификатор

# ### Работа с данными

# In[3]:


df = pd.read_csv('bodyPerformance.csv')
df.head()


# In[4]:


df.shape


# In[5]:


#Пропусков нет
df.isnull().sum()/df.shape[0]


# In[6]:


df.info()


# In[7]:


print(df['gender'].unique())
print(df['class'].unique())


# Закодируем значения в столбцах типа object:

# In[8]:


df['gender'] = df['gender'].replace({'M' : 1, 'F' : 0}) 
df = df.rename(columns={'gender' : 'is_male'})
df['class'] = df['class'].replace({'A' : 0, 'B' : 1, 'C' : 2, 'D' : 3}) 


# In[9]:


df1 = df.drop_duplicates()


# In[10]:


df1.shape


# In[11]:


df1.head()


# In[12]:


X = df1.drop(['class'],axis=1)
y = df1['class']


# In[15]:


min_max_scaler = MinMaxScaler()
X = min_max_scaler.fit_transform(X)


# Разделим датасет на три части: тренировочную (70%), тестовую (20%) и валидационную (10%).

# In[16]:


X_train, X_rem, y_train, y_rem = train_test_split(X, y, train_size=0.7, random_state=77)

X_valid, X_test, y_valid, y_test = train_test_split(X_rem, y_rem, test_size=0.66, random_state=77)


# In[17]:


y_train = to_categorical(y_train)
y_valid = to_categorical(y_valid)
y_test = to_categorical(y_test)


# ### Создание моделей
# #### Base Model

# Создадим базовую модель нейронной сети, состоящую из 2 слоёв:
# 1. 8 нейронов, функция активации - ReLU
# 2. 4 нейрона, функция активации - Softmax

# In[18]:


multi_classifier = Sequential(
    [
        layers.Dense(8, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dense(4, activation = 'softmax')
    ]
)
multi_classifier.summary()


# In[19]:


multi_classifier.compile(loss = 'categorical_crossentropy', optimizer = 'adam', metrics = 'accuracy')


# In[20]:


early_stop = EarlyStopping(monitor = 'val_accuracy', patience = 10, mode = 'max', verbose =1)
checkpoint = ModelCheckpoint('body_weights-{epoch:02d}-{val_r2:.3f}.hdf5',
                             monitor = 'val_accuracy', verbose = 1, mode = 'max',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# Зададим количество объектов в одном батче, равное 10, и число эпох, равное 100:

# In[21]:


multi_class_history = multi_classifier.fit(X_train, y_train, batch_size = 10, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 100)


# In[22]:


plt.figure(figsize=(20,8))
loss_function = multi_class_history.history['loss']
val_loss_function = multi_class_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

acc = multi_class_history.history['accuracy']
val_acc = multi_class_history.history['val_accuracy']
epochs = range(1,len(acc)+1)

plt.subplot(1, 2, 1)
plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()

plt.subplot(1, 2, 2)
plt.title('Accuracy (Train & Val Sets)')
plt.plot(epochs,acc,label='Accuracy (Train)')
plt.plot(epochs,val_acc,color='orange',label='Accuracy (Validation)')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()


# In[36]:


probs = multi_classifier.predict(X_test)
truth = np.argmax(y_test, axis=1)


# In[37]:


predicted = np.argmax(probs, axis=1)


# In[44]:


df_metrics_multi = pd.DataFrame(columns=['model', 'recall', 'precision', 'weighted_accuracy', 'auc'])
recall = round(recall_score(truth, predicted, average='macro'), 4)
precision = round(precision_score(truth, predicted, average='macro'), 4)
weighted_accuracy = round(balanced_accuracy_score(truth, predicted), 4)
auc = round(roc_auc_score(truth, probs, average='macro', multi_class='ovr'), 4)
df_metrics_multi.loc[len(df_metrics_multi.index)] = ['base_model', recall, precision, weighted_accuracy, auc] 


# In[45]:


df_metrics_multi


# #### Second Model

# Во второй модели увеличим количество слоёв, не увиличивая число нейронов и чередуя функции активации:
# 1. 8 нейронов, функция активации - ReLU
# 2. 8 нейронов, функция активации - Sigmoid
# 3. 8 нейронов, функция активации - ReLU
# 4. 8 нейронов, функция активации - Sigmoid
# 5. 8 нейронов, функция активации - ReLU
# 6. 4 нейрона, функция активации - Softmax

# In[51]:


multi_classifier_2 = Sequential(
    [
        layers.Dense(8, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dense(8, activation = 'sigmoid'),
        layers.Dense(8, activation = 'relu'),
        layers.Dense(8, activation = 'sigmoid'),
        layers.Dense(8, activation = 'relu'),
        layers.Dense(4, activation = 'softmax')
    ]
)
multi_classifier_2.summary()


# In[52]:


multi_classifier_2.compile(loss = 'categorical_crossentropy', optimizer = 'adam', metrics = 'accuracy')


# In[53]:


early_stop = EarlyStopping(monitor = 'val_accuracy', patience = 10, mode = 'max', verbose = 1)
checkpoint = ModelCheckpoint('body_weights-{epoch:02d}-{val_accuracy:.3f}.hdf5',
                             monitor = 'val_accuracy', verbose = 1, mode = 'max',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# In[54]:


multi_class_history = multi_classifier_2.fit(X_train, y_train, batch_size = 10, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 100)


# In[55]:


plt.figure(figsize=(20,8))
loss_function = multi_class_history.history['loss']
val_loss_function = multi_class_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

acc = multi_class_history.history['accuracy']
val_acc = multi_class_history.history['val_accuracy']
epochs = range(1,len(acc)+1)

plt.subplot(1, 2, 1)
plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()

plt.subplot(1, 2, 2)
plt.title('Accuracy (Train & Val Sets)')
plt.plot(epochs,acc,label='Accuracy (Train)')
plt.plot(epochs,val_acc,color='orange',label='Accuracy (Validation)')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()


# In[56]:


probs = multi_classifier_2.predict(X_test)
truth = np.argmax(y_test, axis=1)


# In[57]:


predicted = np.argmax(probs, axis=1)


# In[58]:


recall = round(recall_score(truth, predicted, average='macro'), 4)
precision = round(precision_score(truth, predicted, average='macro'), 4)
weighted_accuracy = round(balanced_accuracy_score(truth, predicted), 4)
auc = round(roc_auc_score(truth, probs, average='macro', multi_class='ovr'), 4)
df_metrics_multi.loc[len(df_metrics_multi.index)] = ['second_model', recall, precision, weighted_accuracy, auc] 


# In[59]:


df_metrics_multi


# #### Third Model

# Увеличим количество нейронов на каждом слое, кроме двух последних:
# 1. 64 нейрона, функция активации - ReLU
# 2. 64 нейрона, функция активации - Sigmoid
# 3. 32 нейрона, функция активации - ReLU
# 4. 16 нейронов, функция активации - Sigmoid
# 5. 8 нейронов, функция активации - ReLU
# 6. 4 нейрона, функция активации - Softmax

# In[60]:


multi_classifier_3 = Sequential(
    [
        layers.Dense(64, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dense(64, activation = 'sigmoid'),
        layers.Dense(32, activation = 'relu'),
        layers.Dense(16, activation = 'sigmoid'),
        layers.Dense(8, activation = 'relu'),
        layers.Dense(4, activation = 'softmax')
    ]
)
multi_classifier_3.summary()


# In[61]:


multi_classifier_3.compile(loss = 'categorical_crossentropy', optimizer = 'adam', metrics = 'accuracy')


# In[62]:


early_stop = EarlyStopping(monitor = 'val_accuracy', patience = 10, mode = 'max', verbose = 1)
checkpoint = ModelCheckpoint('body_weights-{epoch:02d}-{val_accuracy:.3f}.hdf5',
                             monitor = 'val_accuracy', verbose = 1, mode = 'max',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# Увеличим число объектов в одном батче в 10 раз и уменьшим количество эпох в 2 раза:

# In[63]:


multi_class_history = multi_classifier_3.fit(X_train, y_train, batch_size = 100, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 50)


# In[64]:


plt.figure(figsize=(20,8))
loss_function = multi_class_history.history['loss']
val_loss_function = multi_class_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

acc = multi_class_history.history['accuracy']
val_acc = multi_class_history.history['val_accuracy']
epochs = range(1,len(acc)+1)

plt.subplot(1, 2, 1)
plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()

plt.subplot(1, 2, 2)
plt.title('Accuracy (Train & Val Sets)')
plt.plot(epochs,acc,label='Accuracy (Train)')
plt.plot(epochs,val_acc,color='orange',label='Accuracy (Validation)')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()


# In[65]:


probs = multi_classifier_3.predict(X_test)
truth = np.argmax(y_test, axis=1)


# In[66]:


predicted = np.argmax(probs, axis=1)


# In[67]:


recall = round(recall_score(truth, predicted, average='macro'), 4)
precision = round(precision_score(truth, predicted, average='macro'), 4)
weighted_accuracy = round(balanced_accuracy_score(truth, predicted), 4)
auc = round(roc_auc_score(truth, probs, average='macro', multi_class='ovr'), 4)
df_metrics_multi.loc[len(df_metrics_multi.index)] = ['third_model', recall, precision, weighted_accuracy, auc] 


# In[68]:


df_metrics_multi


# #### Fourth Model

# Добавим Dropout(0.1) после нескольких первых слоёв. В первом слое увеличим количество нейронов до 128:

# In[90]:


multi_classifier_4 = Sequential(
    [
        layers.Dense(128, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dropout(0.1),
        layers.Dense(64, activation = 'sigmoid'),
        layers.Dropout(0.1),
        layers.Dense(32, activation = 'relu'),
        layers.Dense(16, activation = 'sigmoid'),
        layers.Dense(8, activation = 'relu'),
        layers.Dense(4, activation = 'softmax')
    ]
)
multi_classifier_4.summary()


# Изменим процедуру оптимизации на RMSprop:

# In[91]:


multi_classifier_4.compile(loss = 'categorical_crossentropy', optimizer = 'RMSprop', metrics = 'accuracy')


# In[92]:


early_stop = EarlyStopping(monitor = 'val_accuracy', patience = 10, mode = 'max', verbose = 1)
checkpoint = ModelCheckpoint('body_weights-{epoch:02d}-{val_accuracy:.3f}.hdf5',
                             monitor = 'val_accuracy', verbose = 1, mode = 'max',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# Увеличим количество эпох в 2 раза:

# In[93]:


multi_class_history = multi_classifier_4.fit(X_train, y_train, batch_size = 100, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 100)


# In[94]:


plt.figure(figsize=(20,8))
loss_function = multi_class_history.history['loss']
val_loss_function = multi_class_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

acc = multi_class_history.history['accuracy']
val_acc = multi_class_history.history['val_accuracy']
epochs = range(1,len(acc)+1)

plt.subplot(1, 2, 1)
plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()

plt.subplot(1, 2, 2)
plt.title('Accuracy (Train & Val Sets)')
plt.plot(epochs,acc,label='Accuracy (Train)')
plt.plot(epochs,val_acc,color='orange',label='Accuracy (Validation)')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()


# In[95]:


probs = multi_classifier_4.predict(X_test)
truth = np.argmax(y_test, axis=1)


# In[96]:


predicted = np.argmax(probs, axis=1)


# In[98]:


recall = round(recall_score(truth, predicted, average='macro'), 4)
precision = round(precision_score(truth, predicted, average='macro'), 4)
weighted_accuracy = round(balanced_accuracy_score(truth, predicted), 4)
auc = round(roc_auc_score(truth, probs, average='macro', multi_class='ovr'), 4)
df_metrics_multi.loc[len(df_metrics_multi.index)] = ['fourth_model', recall, precision, weighted_accuracy, auc] 


# In[99]:


df_metrics_multi


# Анализируя полученные метрики 4-х моделей, можно сделать вывод, что наилучшим многоклассовым классификатором является Fourth Model.
# 
# Построим ROC-кривую для каждого класса в данной модели:

# In[103]:


probs_4 = multi_classifier_4.predict(X_test)
truth = np.argmax(y_test, axis=1)


# Выведем графики ROC-кривой отдельного для каждого класса:

# In[170]:


for i in range(0, 4):
    RocCurveDisplay.from_predictions(
        y_test[:, i],
        probs_4[:, i],
        label = f"ROC-кривая для класса {i}"
    )
    x = np.linspace(0, 1, 10)
    y = x
    plt.plot(x,y)
plt.show()


# Построим ROC-кривые для каждого класса на одном графике:

# In[181]:


colors = ['#173f61', '#5b8f9a', '#faab5c', '#841826']
for i in range (0, 4):
    fpr, tpr, treshold = roc_curve(y_test[:,i], probs_4[:,i])
    auc = round(roc_auc_score(y_test[:,i], probs_4[:,i]), 4)
    plt.plot(fpr, tpr, label=f"Класс {i} (area = {auc})", color = colors[i])
    plt.plot([0, 1], [0, 1])
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Пример ROC-кривой')
plt.legend(loc="lower right")
plt.show()


# ### Вывод

# Набор данных 'bodyPerformance.csv' не содержал пропущенных значений, но в нем присутствовал дубликат, который был удален. Значения в столбцах gender и class были закодированы.
# 
# Среди четырёх моделей многоклассовых классификаторов лучше всего сработала Fourth Model. В ней увеличено число слоёв и нейронов на каждом слое по сравнению с Base Model, добавлен Dropout(0.1) после двух первых слоёв и используется процедура оптимизации RMSprop.
# 
# Оценка качества многоклассовых классификаторов происходила по следующим метрикам: Recall, Precision, Weighted Accuracy и AUC. Эти показатели у Fourth Model выше, чем у остальных моделей.

# ### Задание №3
# ### Регрессор

# ### Работа с данными

# In[3]:


df = pd.read_csv('DS_2019_public.csv', encoding = "windows-1251")
df.head()


# In[4]:


df.shape


# In[5]:


for i in df.columns:
    if df[i].isnull().sum() > 0:
        print(df[i].isnull().sum()/df.shape[0])
    else:
        print('Пропусков нет: ', i)


# In[6]:


#Пропусков нет
df.isnull().sum()/df.shape[0]


# In[7]:


df.info(verbose=True, show_counts=True)


# Посмотрим, что находится в столбцах типа object:

# In[8]:


types = df.dtypes
types = types.loc[types == "object"]


# In[9]:


for i in types.index:
    print(i)
    print(df[i].unique())


# Столбцы типа object в основном состоят из числовых значений. Скорее всего, там присутствуют выбросы. Переведем в float все возможные значениях в данных столбцах. Если так сделать нельзя - значение удаляем:

# In[10]:


def convert_to_float(x):
    try:
        return float(x)
    except:
        return np.nan


# In[11]:


for i in types.index:
    df[i] = df[i].apply(lambda x: convert_to_float(x))
    print(i)
    print(df[i].isnull().sum())


# Удаляем строки с пропущенными значениями:

# In[12]:


df.dropna(inplace=True)
df.shape


# In[13]:


#Дубликатов нет
df = df.drop_duplicates()
df.shape


# In[14]:


df.describe()


# В некоторых столбцах присутствуют выбросы в виде отрицательных значений. Удалим такие значения:

# In[15]:


for i in df.columns:
    df.loc[df[i]<0, i] = np.nan
    if (df[i].isnull().sum()/df.shape[0])>0:
        print(i)
        print(df[i].isnull().sum()/df.shape[0])


# Появились столбцы с пропущенными значениями. Удалим столбцы с процентом NaN больше 5%. В остальных удалим строки с пропущенными значениям:

# In[16]:


for i in df.columns:
    if (df[i].isnull().sum()/df.shape[0])>=0.05:
        df = df.drop(i, axis=1)


# In[17]:


df.shape


# In[18]:


df.dropna(inplace=True)


# In[19]:


#Пропущенных значений нет
df.isnull().sum().sum()


# In[20]:


df.head()


# In[21]:


X = df.drop(['TOTALDOL'],axis=1)
y = df['TOTALDOL']


# In[22]:


min_max_scaler = MinMaxScaler()
X = min_max_scaler.fit_transform(X)


# Разделим датасет на три части: тренировочную (70%), тестовую (20%) и валидационную (10%).

# In[23]:


X_train, X_rem, y_train, y_rem = train_test_split(X, y, train_size=0.7, random_state=77)

X_valid, X_test, y_valid, y_test = train_test_split(X_rem, y_rem, test_size=0.66, random_state=77)


# ### Создание моделей
# #### Base Model

# Создадим базовую модель нейронной сети, состоящую из 2 слоёв:
# 1. 16 нейронов, функция активации - ReLU
# 2. 1 нейрон

# In[63]:


regressor = Sequential(
    [
        layers.Dense(16, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dense(1)
    ]
)
regressor.summary()


# In[64]:


regressor.compile(loss = 'mean_squared_error', optimizer = 'adam')


# Будем отслеживать уменьшение функции потерь:

# In[65]:


early_stop = EarlyStopping(monitor = 'val_loss', patience = 10, mode = 'min', verbose =1)
checkpoint = ModelCheckpoint('household-{epoch:02d}-{val_loss:.3f}.hdf5',
                             monitor = 'val_loss', verbose = 1, mode = 'min',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# Возьмем количество эпох в 2 раза больше, чем мы использовали в классификаторах:

# In[66]:


regressor_history = regressor.fit(X_train, y_train, batch_size = 10, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 200)


# In[67]:


plt.figure(figsize=(8,8))
loss_function = regressor_history.history['loss']
val_loss_function = regressor_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()


# In[98]:


probs = regressor.predict(X_test)
truth = y_test


# In[99]:


df_metrics_regress = pd.DataFrame(columns=['model', 'mse', 'mae', 'r2'])
mse = round(mean_squared_error(probs, truth), 3)
mae = round(mean_absolute_error(probs, truth), 3)
r2 = round(r2_score(probs, truth), 5)
df_metrics_regress.loc[len(df_metrics_regress.index)] = ['base_model', mse, mae, r2] 


# In[100]:


df_metrics_regress


# #### Second Model

# Во второй модели увеличим количество слоёв, не увиличивая число нейронов и чередуя функции активации:
# 1. 16 нейронов, функция активации - ReLU
# 2. 16 нейронов, функция активации - Sigmoid
# 3. 16 нейронов, функция активации - SeLU
# 4. 16 нейронов, функция активации - Sigmoid
# 5. 16 нейронов, функция активации - ReLU
# 6. 1 нейрон

# In[72]:


regressor_2 = Sequential(
    [
        layers.Dense(16, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dense(16, activation = 'sigmoid'),
        layers.Dense(16, activation = 'selu'),
        layers.Dense(16, activation = 'sigmoid'),
        layers.Dense(16, activation = 'relu'),
        layers.Dense(1)
    ]
)
regressor_2.summary()


# In[73]:


regressor_2.compile(loss = 'mean_squared_error', optimizer = 'adam')


# In[74]:


early_stop = EarlyStopping(monitor = 'val_loss', patience = 10, mode = 'min', verbose =1)
checkpoint = ModelCheckpoint('household_2-{epoch:02d}-{val_loss:.3f}.hdf5',
                             monitor = 'val_loss', verbose = 1, mode = 'min',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# In[75]:


regressor_history = regressor_2.fit(X_train, y_train, batch_size = 10, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 200)


# In[76]:


plt.figure(figsize=(8,8))
loss_function = regressor_history.history['loss']
val_loss_function = regressor_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()


# In[101]:


probs = regressor_2.predict(X_test)
truth = y_test


# In[102]:


mse = round(mean_squared_error(probs, truth), 3)
mae = round(mean_absolute_error(probs, truth), 3)
r2 = round(r2_score(probs, truth), 5)
df_metrics_regress.loc[len(df_metrics_regress.index)] = ['second_model', mse, mae, r2] 


# In[103]:


df_metrics_regress


# #### Third Model

# Увеличим количество нейронов на каждом слое, кроме двух последних:
# 1. 64 нейрона, функция активации - ReLU
# 2. 64 нейрона, функция активации - Sigmoid
# 3. 32 нейрона, функция активации - SeLU
# 4. 32 нейронов, функция активации - Sigmoid
# 5. 16 нейронов, функция активации - ReLU
# 6. 1 нейрон

# In[86]:


regressor_3 = Sequential(
    [
        layers.Dense(64, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dense(64, activation = 'sigmoid'),
        layers.Dense(32, activation = 'selu'),
        layers.Dense(32, activation = 'sigmoid'),
        layers.Dense(16, activation = 'relu'),
        layers.Dense(1)
    ]
)
regressor_3.summary()


# In[91]:


regressor_3.compile(loss = 'mean_squared_error', optimizer = 'adam')


# In[92]:


early_stop = EarlyStopping(monitor = 'val_loss', patience = 10, mode = 'min', verbose = 1)
checkpoint = ModelCheckpoint('household_3-{epoch:02d}-{val_loss:.3f}.hdf5',
                             monitor = 'val_loss', verbose = 1, mode = 'min',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# Увеличим число объектов в одном батче в 10 раз и уменьшим количество эпох в 1,25 раз:

# In[93]:


regressor_history = regressor_3.fit(X_train, y_train, batch_size = 100, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 160)


# In[94]:


plt.figure(figsize=(8,8))
loss_function = regressor_history.history['loss']
val_loss_function = regressor_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()


# In[104]:


probs = regressor_3.predict(X_test)
truth = y_test


# In[105]:


mse = round(mean_squared_error(probs, truth), 3)
mae = round(mean_absolute_error(probs, truth), 3)
r2 = round(r2_score(probs, truth), 5)
df_metrics_regress.loc[len(df_metrics_regress.index)] = ['third_model', mse, mae, r2] 


# In[106]:


df_metrics_regress


# #### Fourth Model

# Добавим Dropout(0.1) после нескольких первых слоёв. В первом слое увеличим количество нейронов до 128:

# In[150]:


regressor_4 = Sequential(
    [
        layers.Dense(128, activation = 'relu', input_dim = X_train.shape[1]),
        layers.Dropout(0.1),
        layers.Dense(64, activation = 'sigmoid'),
        layers.Dropout(0.1),
        layers.Dense(32, activation = 'selu'),
        layers.Dense(32, activation = 'sigmoid'),
        layers.Dense(16, activation = 'relu'),
        layers.Dense(1)
    ]
)
regressor_4.summary()


# Изменим процедуру оптимизации на RMSprop:

# In[151]:


regressor_4.compile(loss = 'mean_squared_error', optimizer = 'adam')


# In[152]:


early_stop = EarlyStopping(monitor = 'val_loss', patience = 10, mode = 'min', verbose = 1)
checkpoint = ModelCheckpoint('household_4-{epoch:02d}-{val_loss:.3f}.hdf5',
                             monitor = 'val_loss', verbose = 1, mode = 'min',
                             save_best_only = True)
callbacks_list = [early_stop,checkpoint]


# Увеличим количество эпох в 1,25 раз:

# In[153]:


regressor_history = regressor_4.fit(X_train, y_train, batch_size = 100, validation_data = (X_valid, y_valid),
                                        callbacks = callbacks_list, epochs = 200)


# In[154]:


plt.figure(figsize=(8,8))
loss_function = regressor_history.history['loss']
val_loss_function = regressor_history.history['val_loss']
epochs = range(1,len(loss_function)+1)

plt.title('Loss function (Train & Val Sets)')
plt.plot(epochs,loss_function,label='Train Loss')
plt.plot(epochs,val_loss_function,color='orange',label='Val Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss function')
plt.legend()


# In[155]:


probs = regressor_4.predict(X_test)
truth = y_test


# In[156]:


mse = round(mean_squared_error(probs, truth), 3)
mae = round(mean_absolute_error(probs, truth), 3)
r2 = round(r2_score(probs, truth), 5)
df_metrics_regress.loc[len(df_metrics_regress.index)] = ['fourth_model', mse, mae, r2] 


# In[157]:


df_metrics_regress


# Анализируя полученные метрики 4-х моделей, можно сделать вывод, что наилучшим регрессором является Third Model.

# ### Вывод

# Набор данных 'DS_2019_public.csv' изначально не содержал пропущенных значений. Столбцы типа object состояли из числовых значений, поэтому мы перевели данные в них в float, а при невозможности такого преобразования удаляли строки с выбросами. В некоторых столбцах были выбросы в виде отрицательных значений. После удаления этих значений появились столбцы с NaN. Cтолбцы с процентом NaN больше 5% мы удалили, а в остальных столбцах удалили строки с пропущенными значениям. Дубликатов нет.
# 
# Среди четырёх моделей регрессоров лучше всего сработала Third Model. В ней увеличено число слоёв и нейронов на каждом слое по сравнению с Base Model, но не использовался Dropout(0.1).
# 
# Оценка качества регрессоров происходила по следующим метрикам: MSE, MAE и R2. Первые два показателя у Third Model нижу, чем у остальных моделей, а последний - выше.
