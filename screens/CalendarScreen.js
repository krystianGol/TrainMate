import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "../store/calendarSlice";
import {
  saveEvent,
  loadEvents,
  removeEventFromDatabase,
} from "../utils/actions/calendarActions";
import AntDesign from "@expo/vector-icons/AntDesign";
import { setEvents, removeEvent } from "../store/calendarSlice";
import EventItem from "../components/EventItem";
import PageContainer from "../components/PageContainer";

const CalendarScreen = (props) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const dispatch = useDispatch();
  const events = useSelector(
    (state) => state.calendar.storedEvents[selectedDay] || []
  );
  const storedEvents = useSelector((state) => state.calendar.storedEvents);
  const userData = useSelector((state) => state.auth.userData);

  const markedDates = useMemo(() => {
    const marks = {};

    Object.keys(storedEvents).forEach((date) => {
      if (storedEvents[date]?.length > 0) {
        marks[date] = {
          marked: true,
          dotColor: "#007AFF",
        };
      }
    });

    if (selectedDay) {
      marks[selectedDay] = {
        ...(marks[selectedDay] || {}),
        selected: true,
        selectedColor: "#007AFF",
        selectedTextColor: "white",
      };
    }

    return marks;
  }, [storedEvents, selectedDay]);

  const addNewEvent = (day) => {
    setSelectedDay(day.dateString);
  };

  const handleSaveEvent = async () => {
    const eventData = {
      date: selectedDay,
      title: eventTitle,
      time: eventTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    dispatch(addEvent(eventData));

    await saveEvent(userData.userId, eventData);

    setEventTitle("");
    setModalVisible(false);
    setEventTime(new Date());
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setEventTime(selectedTime);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userData?.userId) return;

      const loadedEvents = await loadEvents(userData.userId);

      dispatch(setEvents(loadedEvents));
    };

    fetchEvents();
  }, [userData]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)} title="test">
          <AntDesign
            style={styles.addEventIcon}
            name="pluscircleo"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageContainer>
        <Calendar
          onDayPress={addNewEvent}
          markedDates={markedDates}
          minDate={new Date().toISOString().split("T")[0]}
        />
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.modal}
          avoidKeyboard={true}
        >
          <View style={styles.modalContentContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <ScrollView
                contentContainerStyle={styles.modalContent}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalTitle}>Add event</Text>
                <Text style={styles.modalDate}>{selectedDay}</Text>

                <TextInput
                  placeholder="Event title"
                  style={styles.input}
                  value={eventTitle}
                  onChangeText={setEventTitle}
                />

                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.timeButtonText}>
                    Pick time event:{" "}
                    {eventTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>

                <DateTimePicker
                  isVisible={showTimePicker}
                  mode="time"
                  date={eventTime}
                  onConfirm={(date) => {
                    setEventTime(date);
                    setShowTimePicker(false);
                  }}
                  onCancel={() => setShowTimePicker(false)}
                  is24Hour={true}
                  confirmTextIOS='Wybierz'
                  cancelTextIOS='Anuluj'
                  pickerContainerStyleIOS={styles.pickerStyle}
                />

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveEvent}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        <FlatList
          data={events}
          renderItem={(itemData) => {
            const eventData = itemData.item;
            const eventTime = eventData.time;
            const eventTitle = eventData.title;
            const eventId = eventData.id;

            return (
              <EventItem
                title={eventTitle}
                time={eventTime}
                onDelete={async () => {
                  dispatch(removeEvent({ date: selectedDay, id: eventId }));
                  await removeEventFromDatabase(userData.userId, eventId);
                }}
              />
            );
          }}
        />
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 16,
    color: "#888",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeButton: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  timeButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dateTimePicker: {
    alignSelf: "center",
    marginBottom: 15,
  },
  addEventIcon: {
    marginRight: 10,
  },
  pickerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CalendarScreen;
